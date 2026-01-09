import express from 'express';
import { registerUser, loginUser, getMe , logiadmin ,refreshAccessToken , verifyAccessToken , verifyadminAccessToken , AdminRefreshAccessToken , logoutUser  , googleAuth, sendOtpCode, verifyOtpCode } from '../controllers/authController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';
const router = express.Router();

// Register a new user || admin
router.post('/register', registerUser);
//get user
router.get('/me', protect, getMe);
// Admin routes
router.post('/loginadmin', logiadmin);
router.post('/adminrefresh', AdminRefreshAccessToken);
router.post('/verifyadmin', protect , adminAuthMiddleware ,verifyadminAccessToken);
// User routes
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/verify',protect , verifyAccessToken);
router.post('/logout', logoutUser);

//google auth
router.post('/google', googleAuth);

router.post('/send-otp', sendOtpCode);
router.post('/verify-otp', verifyOtpCode);

export default router;