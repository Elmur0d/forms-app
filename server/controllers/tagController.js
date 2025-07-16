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