import express from 'express';
import { submitForm, getFormById, getMySubmissions } from '../controllers/formController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/my').get(protect, getMySubmissions);

router.route('/').post(protect, submitForm);
router.route('/:id').get(protect, getFormById);

export default router;