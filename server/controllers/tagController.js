import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { templates: true },
        },
      },
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

export const searchTags = async (req, res) => {
  const { term } = req.query;
  if (!term) return res.json([]);

  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: term.toLowerCase(),
          mode: 'insensitive',
        },
      },
      take: 10,
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};