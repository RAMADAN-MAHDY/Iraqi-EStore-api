import express from 'express';
import { registerUser, loginUser, getMe , logiadmin } from '../controllers/authController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/loginadmin', logiadmin);

export default router;