import express from 'express';
import { createTemplate, getMyTemplates, getTemplates, getTemplateById, updateTemplate, deleteTemplate, getPopularTemplates } from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';
import { addQuestion } from '../controllers/questionController.js';
import { getSubmissionsForTemplate } from '../controllers/formController.js';
import { getTemplateStats } from '../controllers/templateController.js';
import { toggleLike, addComment } from '../controllers/interactionController.js';

const optionalProtect = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return protect(req, res, next);
    }
    next();
};

const router = express.Router();

router.route('/').get(getTemplates).post(protect, createTemplate);

router.route('/popular').get(getPopularTemplates);

router.route('/my').get(protect, getMyTemplates);

router
  .route('/:id')
  .get(optionalProtect, getTemplateById) 
  .put(protect, updateTemplate)
  .delete(protect, deleteTemplate);

router.route('/:templateId/questions').post(protect, addQuestion);
router.route('/:templateId/forms').get(protect, getSubmissionsForTemplate);
router.route('/:id/stats').get(protect, getTemplateStats);
router.route('/:id/like').post(protect, toggleLike);
router.route('/:id/comments').post(protect, addComment);

export default router;