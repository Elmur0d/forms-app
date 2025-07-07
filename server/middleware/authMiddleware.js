import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await prisma.user.findUnique({
        where: { id: decoded.user.id },
        select: { id: true, email: true, name: true, role: true },
      });
      
      next(); 
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Нет авторизации, токен недействителен' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'Нет авторизации, отсутствует токен' });
  }
};