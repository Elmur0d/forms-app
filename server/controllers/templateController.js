import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createTemplate = async (req, res) => {
  const { title, description, topic, isPublic } = req.body;
  
  if (!title) {
    return res.status(400).json({ msg: 'Пожалуйста, укажите заголовок' });
  }

  try {
    const newTemplate = await prisma.template.create({
      data: {
        title,
        description,
        topic,
        isPublic,
        authorId: req.user.id, 
      },
    });
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' }, 
      include: {
        author: {
          select: { name: true, email: true }, 
        },
      },
    });
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

export const getMyTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      where: { authorId: req.user.id }, 
      orderBy: { updatedAt: 'desc' },
    });
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};


export const getTemplateById = async (req, res) => {
  const { id } = req.params;
  try {
    const template = await prisma.template.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { name: true } },
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!template) {
      return res.status(404).json({ msg: 'Шаблон не найден' });
    }

    if (!template.isPublic) {
      if (!req.user) {
        return res.status(403).json({ msg: 'Доступ запрещен' });
      }
      if (template.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ msg: 'Доступ запрещен' });
      }
    }

    res.json(template);

  } catch (error) {
    console.error('Get Template By Id Error:', error);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    let template = await prisma.template.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!template) {
      return res.status(404).json({ msg: 'Шаблон не найден' });
    }

    if (template.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ msg: 'Действие запрещено' });
    }

    const { title, description, topic, isPublic } = req.body;
    const updatedTemplate = await prisma.template.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description, topic, isPublic },
    });
    
    res.json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const template = await prisma.template.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!template) {
      return res.status(404).json({ msg: 'Шаблон не найден' });
    }
    
    if (template.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ msg: 'Действие запрещено' });
    }
    
    await prisma.question.deleteMany({
      where: { templateId: parseInt(req.params.id) },
    });

    await prisma.template.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ msg: 'Шаблон успешно удален' });
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

export const getPopularTemplates = async (req, res) => {
  try {
    const popularTemplates = await prisma.template.findMany({
      where: { isPublic: true },
      include: {
        _count: { 
          select: { forms: true }, 
        },
        author: { select: { name: true } },
      },
      orderBy: {
        forms: {
          _count: 'desc', 
        },
      },
      take: 5, 
    });
    res.json(popularTemplates);
  } catch (error) {
    console.error('Get popular templates failed:', error);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};