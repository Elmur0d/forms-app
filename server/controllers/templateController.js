import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createTemplate = async (req, res) => {
  const { title, description, topic, isPublic, tags } = req.body;
  
  if (!title) {
    return res.status(400).json({ msg: 'Пожалуйста, укажите заголовок' });
  }

  try {

    const tagOperations = tags?.map(tagName => {
        return {
            where: { name: tagName.toLowerCase() },
            create: { name: tagName.toLowerCase() },
        };
    }) || [];


    const newTemplate = await prisma.template.create({
      data: {
        title,
        description,
        topic,
        isPublic,
        authorId: req.user.id, 
        tags: { 
          connectOrCreate: tagOperations,
        },
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
        tags: true,
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
    const templateId = parseInt(req.params.id);
    const { title, description, topic, isPublic, allowedUserIds } = req.body;

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { allowedUsers: true }, 
    });

    if (!template) {
      return res.status(404).json({ msg: 'Шаблон не найден' });
    }

    if (template.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ msg: 'Действие запрещено' }); 
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (topic !== undefined) dataToUpdate.topic = topic;
    if (isPublic !== undefined) dataToUpdate.isPublic = isPublic;

    if (allowedUserIds !== undefined) {
      dataToUpdate.allowedUsers = {
        set: allowedUserIds.map(id => ({ id: parseInt(id) })),
      };
    }

    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: dataToUpdate,
    });
    
    res.json(updatedTemplate);
  } catch (error) {
    console.error("Update template failed:", error);
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