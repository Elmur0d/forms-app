import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// @route   POST /api/templates/:templateId/questions
// @desc    Add a question to a template
// @access  Private
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

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private
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

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private
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