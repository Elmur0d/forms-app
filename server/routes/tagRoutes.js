import express from 'express';
import { getAllTags } from '../controllers/tagController.js';
const router = express.Router();
router.route('/').get(getAllTags);
export default router;