import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, isBlocked: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

export const toggleAdmin = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });
        if (user.id === req.user.id) {
            return res.status(400).json({ msg: 'Вы не можете изменить свою собственную роль' });
        }
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { role: newRole },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

export const toggleBlock = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });
        if (user.id === req.user.id) {
            return res.status(400).json({ msg: 'Вы не можете заблокировать самого себя' });
        }
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { isBlocked: !user.isBlocked },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

export const deleteUser = async (req, res) => {
    try {
      const userToDelete = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
      if (!userToDelete) {
        return res.status(404).json({ msg: 'Пользователь не найден' });
      }
      if (userToDelete.id === req.user.id) {
        return res.status(400).json({ msg: 'Вы не можете удалить свой собственный аккаунт' });
      }
      await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
      res.json({ msg: 'Пользователь успешно удален' });
    } catch (error) {
      console.error('Delete user failed:', error);
      res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

export const searchUsers = async (req, res) => {
    const { term } = req.query;
    if (!term) return res.json([]);

    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true },
        take: 10,
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ msg: 'Ошибка сервера' });
    }
};