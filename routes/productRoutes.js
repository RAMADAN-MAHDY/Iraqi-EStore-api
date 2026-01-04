import express from 'express';
import { create, getAll, getById, update, remove, getOffers } from '../controllers/productController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import { adminAuthMiddleware as authorize } from '../middleware/adminAuthMiddleware.js';
import uploadImage  from '../middleware/multerUpload.js';
const router = express.Router();

router.route('/')
  .post(protect, authorize ,uploadImage.single('image'), create)
  .get(getAll);

router.route('/category/:categoryId')
  .get(getAll);

router.route('/offers')
  .get(getOffers);

router.route('/:id')
  .get(getById)
  .put(protect, authorize, update)
  .delete(protect, authorize, remove);

export default router;