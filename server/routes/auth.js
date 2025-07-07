import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


const registerValidation = [
  body('email', 'Пожалуйста, введите корректный email').isEmail(),
  body('password', 'Пароль должен содержать минимум 6 символов').isLength({ min: 6 }),
];


const loginValidation = [
  body('email', 'Пожалуйста, введите корректный email').isEmail(),
  body('password', 'Пароль не может быть пустым').exists(),
];



router.post('/register', registerValidation, register);


router.post('/login', loginValidation, login);


router.get('/me', protect, getMe);

export default router;