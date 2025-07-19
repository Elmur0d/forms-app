import express from 'express';
import { getUsers, toggleAdmin, deleteUser, searchUsers  } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id/toggle-admin').put(protect, admin, toggleAdmin);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/search').get(protect, searchUsers);

export default router;