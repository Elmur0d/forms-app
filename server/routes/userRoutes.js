import express from 'express';
import { getUsers, toggleAdmin, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/').get(getUsers);
router.route('/:id/toggle-admin').put(toggleAdmin);
router.route('/:id').delete(deleteUser);

export default router;