import express from 'express';
import { getAllTags, searchTags } from '../controllers/tagController.js';
const router = express.Router();
router.route('/search').get(searchTags);
router.route('/').get(getAllTags);
export default router;