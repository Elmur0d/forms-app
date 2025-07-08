import express from 'express';
import {
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from '../controllers/questionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/reorder').put(protect, reorderQuestions);

router
  .route('/:id')
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

export default router;