import express from 'express';
import {
  getUsers,
  toggleAdmin,
  deleteUser,
  searchUsers,
  toggleBlock 
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/search').get(protect, searchUsers);

router.route('/').get(protect, admin, getUsers);
router.route('/:id/toggle-admin').put(protect, admin, toggleAdmin);
router.route('/:id/toggle-block').put(protect, admin, toggleBlock);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;