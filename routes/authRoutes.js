import express from 'express';
import {
    registerUser,
    loginUser,
    googleAuth,
    sendOtpCode,
    verifyOtpCode,
    getMe,
    logiadmin,
    refreshAccessToken,
    AdminRefreshAccessToken,
    verifyAccessToken,
    verifyadminAccessToken,
    logoutUser
} from '../controllers/authController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import { adminAuthMiddleware as authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/loginadmin', logiadmin);
router.post('/google', googleAuth);
router.post('/send-otp', sendOtpCode);
router.post('/verify-otp', verifyOtpCode);
router.get('/me', protect, getMe);
router.post('/refresh', refreshAccessToken);
router.post('/adminrefresh', AdminRefreshAccessToken);
router.post('/verify', protect, verifyAccessToken);
router.post('/verifyadmin', protect, authorize, verifyadminAccessToken);
router.post('/logout', logoutUser);

export default router;
