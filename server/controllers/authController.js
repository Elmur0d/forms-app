import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const register = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  try {
   
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.status(400).json({ msg: 'Пользователь с таким email уже существует' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    

    res.status(201).json({ msg: 'Пользователь успешно зарегистрирован', userId: user.id });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};



export const login = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: 'Неверные учетные данные' });
    }

    if (user.isBlocked) {
        return res.status(403).json({ msg: 'Ваш аккаунт заблокирован' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Неверные учетные данные' });
    }

    
    const payload = {
      user: {
        id: user.id,
        role: user.role, 
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};