import express from 'express';
import { submitForm, getFormById  } from '../controllers/formController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, submitForm);
router.route('/:id').get(protect, getFormById);

export default router;