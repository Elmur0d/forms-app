import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const searchTemplates = async (req, res) => {
  const { term } = req.query; 

  if (!term) {
    return res.json([]); 
  }

  try {
    const results = await prisma.template.findMany({
      where: {
        isPublic: true, 
        OR: [ 
          {
            title: {
              contains: term,
              mode: 'insensitive', 
            },
          },
          {
            description: {
              contains: term,
              mode: 'insensitive',
            },
          },
          {
            questions: { 
              some: {
                title: {
                  contains: term,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
      include: {
        author: { select: { name: true } },
      },
    });
    res.json(results);
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};