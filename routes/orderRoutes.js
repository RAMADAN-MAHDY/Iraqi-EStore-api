import express from 'express';
import { create, getByUserId, getAll, updateStatus, remove } from '../controllers/orderController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import { adminAuthMiddleware as authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, create)
  .get(protect, authorize, getAll); // Admin can get all orders

router.route('/status')
  .put(protect, authorize, updateStatus); // Admin can update order status

router.route('/:userId')
  .get(protect, getByUserId); // User can get their own orders

router.route('/:id')
  .delete(protect, authorize, remove); // Admin can delete orders

export default router;