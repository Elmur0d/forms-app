import express from 'express';
import { submitForm } from '../controllers/formController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, submitForm);

export default router;