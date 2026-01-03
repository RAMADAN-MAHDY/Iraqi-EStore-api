import express from 'express';
import { create, getAll, getById, update, remove } from '../controllers/categoryController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import { adminAuthMiddleware as authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize, create)
  .get(getAll);

router.route('/:id')
  .get(getById)
  .put(protect, authorize, update)
  .delete(protect, authorize, remove);

export default router;