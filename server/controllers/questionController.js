import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addQuestion = async (req, res) => {
  const { templateId } = req.params;
  const { title, type } = req.body;
  if (!title || !type) {
    return res.status(400).json({ msg: 'Пожалуйста, укажите заголовок и тип вопроса' });
  }
  try {
    const template = await prisma.template.findUnique({ where: { id: parseInt(templateId) } });
    if (!template || (template.authorId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ msg: 'Действие запрещено' });
    }
    const questionsCountByType = await prisma.question.count({ where: { templateId: parseInt(templateId), type: type } });
    if (questionsCountByType >= 4) {
      return res.status(400).json({ msg: `Достигнут лимит (4) для вопросов типа "${type}"` });
    }
    const questionsCount = await prisma.question.count({ where: { templateId: parseInt(templateId) } });
    const newQuestion = await prisma.question.create({
      data: { title, type, templateId: parseInt(templateId), order: questionsCount },
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Add question failed:', error);
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
        await prisma.question.delete({ where: { id: parseInt(id) } });
        res.json({ msg: 'Вопрос удален' });
    } catch (error) {
        console.error('Delete question failed:', error);
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

export const reorderQuestions = async (req, res) => {
  try {
    console.log(`--- REORDER REQUEST RECEIVED at ${new Date().toISOString()} ---`);
    const { orderedQuestionIds } = req.body;

    if (!orderedQuestionIds) {
      console.log('REORDER ERROR: "orderedQuestionIds" not found in request body.');
      return res.status(400).json({ msg: 'Тело запроса должно содержать orderedQuestionIds' });
    }

    console.log(`REORDER SUCCESS: Received ${orderedQuestionIds.length} IDs. Sending 200 OK.`);
    
    // Ничего не делаем с базой данных, просто отправляем успешный ответ
    res.status(200).json({ 
      message: 'Тестовый запрос на сортировку прошел успешно!',
      received_ids: orderedQuestionIds 
    });

  } catch (error) {
    console.error('--- CRITICAL ERROR IN REORDER FUNCTION ---:', error);
    res.status(500).json({ msg: 'Критическая ошибка на сервере.' });
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