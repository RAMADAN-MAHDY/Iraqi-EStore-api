import express from 'express';
import { getCart, addItem, updateItem, removeItem } from '../controllers/cartController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addItem);

router.route('/item')
  .put(protect, updateItem)
  .delete(protect, removeItem);

router.route('/:userId')
  .get(protect, getCart);

export default router;