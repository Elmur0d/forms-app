import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const toggleLike = async (req, res) => {
  const templateId = parseInt(req.params.id);
  const userId = req.user.id;
  try {
    const existingLike = await prisma.like.findUnique({
      where: { templateId_userId: { templateId, userId } },
    });
    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      res.json({ message: 'Like removed' });
    } else {
      await prisma.like.create({ data: { templateId, userId } });
      res.json({ message: 'Like added' });
    }
  } catch (error) { res.status(500).json({ msg: 'Ошибка сервера' }); }
};

export const addComment = async (req, res) => {
  const templateId = parseInt(req.params.id);
  const userId = req.user.id;
  const { text } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: { text, templateId, userId },
      include: { user: { select: { name: true, email: true } } },
    });
    res.status(201).json(comment);
  } catch (error) { res.status(500).json({ msg: 'Ошибка сервера' }); }
};