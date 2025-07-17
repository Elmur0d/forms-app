import express from 'express';
import { createHelpTicket } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createHelpTicket);

export default router;