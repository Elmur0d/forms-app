import express from 'express';
import { searchTemplates } from '../controllers/searchController.js';

const router = express.Router();

router.route('/').get(searchTemplates);

export default router;