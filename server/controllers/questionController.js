import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const addQuestion = async (req, res) => {
  const { templateId } = req.params;
  const { title, type } = req.body;

  if (!title || !type) {
    return res.status(400).json({ msg: 'Пожалуйста, укажите заголовок и тип вопроса' });
  }

  try {
    const template = await prisma.template.findUnique({
      where: { id: parseInt(templateId) },
    });

    if (!template || (template.authorId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ msg: 'Действие запрещено' });
    }

    const questionsCountByType = await prisma.question.count({
      where: {
        templateId: parseInt(templateId),
        type: type, 
      },
    });

    if (questionsCountByType >= 4) {
      return res.status(400).json({ msg: `Достигнут лимит (4) для вопросов типа "${type}"` });
    }

    const questionsCount = await prisma.question.count({ where: { templateId: parseInt(templateId) } });

    const newQuestion = await prisma.question.create({
      data: {
        title,
        type,
        templateId: parseInt(templateId),
        order: questionsCount, 
      },
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};


export const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { title, type } = req.body;

    try {
        const question = await prisma.question.findUnique({
            where: { id: parseInt(id) },
            include: { template: true },
        });

        if (!question || (question.template.authorId !== req.user.id && req.user.role !== 'ADMIN')) {
            return res.status(403).json({ msg: 'Действие запрещено' });
        }

        const updatedQuestion = await prisma.question.update({
            where: { id: parseInt(id) },
            data: { title, type },
        });

        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

export const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    
    try {
        const question = await prisma.question.findUnique({
            where: { id: parseInt(id) },
            include: { template: true },
        });

        if (!question || (question.template.authorId !== req.user.id && req.user.role !== 'ADMIN')) {
            return res.status(403).json({ msg: 'Действие запрещено' });
        }

        await prisma.question.delete({
            where: { id: parseInt(id) },
        });

        res.json({ msg: 'Вопрос удален' });
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

export const reorderQuestions = async (req, res) => {
  const { orderedQuestionIds } = req.body;

  if (!orderedQuestionIds || !Array.isArray(orderedQuestionIds) || orderedQuestionIds.length === 0) {
    return res.status(400).json({ msg: 'Необходим массив orderedQuestionIds' });
  }

  try {
    const firstQuestion = await prisma.question.findUnique({
      where: { id: parseInt(orderedQuestionIds[0]) },
      include: { template: true },
    });

    if (!firstQuestion) {
      return res.status(404).json({ msg: 'Вопрос не найден' });
    }

    if (firstQuestion.template.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ msg: 'Действие запрещено' });
    }

    const transaction = orderedQuestionIds.map((id, index) =>
      prisma.question.update({
        where: { id: parseInt(id) },
        data: { order: index },
      })
    );
    
    await prisma.$transaction(transaction);
    
    res.status(200).json({ msg: 'Порядок вопросов успешно обновлен' });
  } catch (error) {
    console.error('Reorder failed:', error);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};