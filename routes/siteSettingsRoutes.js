import express from 'express';
import { getSettings, updateSettings } from '../controllers/siteSettingsController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import { adminAuthMiddleware as authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, authorize, updateSettings);

export default router;