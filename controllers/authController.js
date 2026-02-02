import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } from '../utils/jwt.js';
import { OAuth2Client } from 'google-auth-library';
import { sendOtp, verifyOtp, loginWithPhone } from '../services/authService.js';


const clientOA = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

// POST /auth/google
export const googleAuth = async (req, res) => {
    try {
        const { token, client } = req.body;

        if (!token) {
            res.status(400).json({ error: "Token is required" });
            return;
        }
        // process.env.GOOGLE_CLIENT_ID
        //407408718192.apps.googleusercontent.com           client ID testing from playground
        // console.log("Google Token Received:", token);
        // تحقق من التوكين عند جوجل
        const ticket = await clientOA.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload()
        if (!payload) {
            res.status(401).json({ error: "Invalid Google token payload" });
            return;
        }

        const { email, name, picture, sub } = payload; // sub = unique google id

        if (!email) {
            res.status(400).json({ error: "Email not found in Google token" });
            return;
        }
        // شيك هل المستخدم موجود
        let user = await User.findOne({ email });
        if (!user) {
            // لو مش موجود، أنشئه
            user = await User.create({
                email,
                username: name,
                googleId: sub,
                avatar: picture,
            });
        }

        const accessToken = generateToken({ id: user._id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id });

        if (client === "web") {
            // ✅ تخزين التوكنات في الكوكيز
            // أنشئ JWT خاص بيك
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,

                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,

                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                message: "Login successful (web)",
                user: { id: user._id, username: user.username, email: user.email },
            });
        } else {
            // ✅ إرجاع التوكنات في response body (للموبايل)
            res.status(200).json({
                message: "Login successful (mobile)",
                tokens: { accessToken, refreshToken },
                user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
            });
            return;
        }



    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ error: "Invalid Google token" });
    }
};

// إنشاء حساب جديد
export const registerUser = async (req, res) => {
    try {
        let { username, email, phone, password } = req.body;

        /* =======================
           1️⃣ Normalize & Sanitize
        ======================= */
        username = username?.trim();
        email = email?.trim().toLowerCase();
        phone = phone?.trim();
        password = password?.trim();

        /* =======================
           2️⃣ Required Fields
        ======================= */
        if (!username || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        /* =======================
           3️⃣ Email Validation
        ======================= */
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }
        /* =======================
              3️⃣ Email Validation length
           ======================= */
        if (email.length < 6 || email.length > 100) {
            return res.status(400).json({
                message: "Email length must be between 6 and 100 characters",
            });
        }

        /* =======================
           5️⃣ Password Policy
        ======================= */
        if (password.length < 6 || password.length > 12) {
            return res.status(400).json({
                message: "Password must be between 6 and 12 characters",
            });
        }
        /* =======================
           4️⃣ Username Validation
        ======================= */
        if (username.length < 5 || username.length > 20) {
            return res.status(400).json({
                message: "Username must be between 5 and 20 characters",
            });
        }

        /* =======================
           6️⃣ Check Existing User
        ======================= */
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email or phone already registered",
            });
        }

        /* =======================
           7️⃣ Hash Password
        ======================= */
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        /* =======================
           8️⃣ Create User
           (role NOT from request)
        ======================= */
        const newUser = new User({
            username,
            email,
            phone,
            password: hashedPassword,
            role: "user", // hard-coded (Best Practice)
        });

        await newUser.save();

        /* =======================
           9️⃣ Response (No Password)
        ======================= */
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                createdAt: newUser.createdAt,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};


export const sendOtpCode = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(400).json({ message: 'Phone number is required' });
        return;
    }

    try {
        await sendOtp(phone);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export const verifyOtpCode = asyncHandler(async (req, res) => {
    const { phone, otpCode, client } = req.body;

    if (!phone || !otpCode) {
        res.status(400).json({ message: 'Phone number and OTP code are required' });
        return;
    }

    try {
        const isVerified = await verifyOtp(phone, otpCode);

        if (isVerified) {
            const user = await loginWithPhone(phone);
            const accessToken = generateToken({ id: user._id, email: user.email, role: user.role });
            const refreshToken = generateRefreshToken({ id: user._id });

            if (client === "web") {
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 15 * 60 * 1000,
                });

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                res.status(200).json({
                    message: "Login successful",
                    user: { id: user._id, username: user.username, email: user.email, phone: user.phone },
                });
            } else {
                res.status(200).json({
                    message: "Login successful",
                    user: { id: user._id, username: user.username, email: user.email, phone: user.phone },
                    tokens: { accessToken, refreshToken },
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid OTP code' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get user profile
export const getMe = asyncHandler(async (req, res) => {
    console.log("getMe called: " + req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
});

// يمكنك إضافة دوال تسجيل الدخول وتسجيل الخروج هنا لاحقًا
export const logiadmin = async (req, res) => {
    try {
        const { email, password, client } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (!email.includes("@")) {
            res.status(400).json({ message: "Email must contain @ symbol" });
            return;
        }

        if (password.length > 12 && password.length < 6) {
            res.status(400).json({ message: "Password must be between 6 and 12 characters" });
            return;
        }


        const user = await User.findOne({ email });
        if (!user || user.role !== "admin") {
            res.status(401).json({ message: "Invalid credentials" });
            return; // هنا لو مش موجود      
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const accessToken = generateToken({ id: user._id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id });

        // ✅ تخزين التوكنات في الكوكيز
        if (client === "web") {
            // ✅ تخزين التوكنات في الكوكيز
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,

                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,

                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                message: "Login successful (web)",
                user: { id: user._id, username: user.username, email: user.email },
            });
        } else {
            // ✅ إرجاع التوكنات في response body (للموبايل)
            res.status(200).json({
                message: "Login successful (mobile)",
                tokens: { accessToken, refreshToken },
                user: { id: user._id, username: user.username, email: user.email },
            });
        }




    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password, client } = req.body;
        // client = "web" أو "mobile" يجي من الـ frontend

        // Validate email and password
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        // Validate password length
        if (password.length > 12 && password.length < 6) {
            res.status(400).json({ message: "Password must be between 6 and 12 characters" });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const accessToken = generateToken({ id: user._id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id });

        if (client === "web") {
            // ✅ تخزين التوكنات في الكوكيز
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,

                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,

                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                message: "Login successful (web)",
                user: { id: user._id, username: user.username, email: user.email },
            });
        } else {
            // ✅ إرجاع التوكنات في response body (للموبايل)
            res.status(200).json({
                message: "Login successful (mobile)",
                tokens: { accessToken, refreshToken },
                user: { id: user._id, username: user.username, email: user.email },
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// =============== [ REFRESH TOKEN ] ===============
export const refreshAccessToken = async (
    req,
    res
) => {
    try {
        const client = req.body.client || "web";
        let refreshToken;

        if (client === "web") {
            refreshToken = req.cookies?.refreshToken;
        } else {
            refreshToken = req.body.refreshToken || req.headers["authorization"]?.split(" ")[1];
        }

        if (!refreshToken) {
            res.status(401).json({ message: "No refresh token provided" });
            return;
        }

        const { valid, expired, decoded } = verifyRefreshToken(refreshToken);
        if (!valid || !decoded) {
            res.status(401).json({ message: expired ? "Refresh token expired" : "Invalid refresh token" });
            return;
        }

        // إنشاء Access Token جديد
        const newAccessToken = generateToken({ id: (decoded).id, role: "user", email: (decoded).email });

        if (client === "web") {
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,

                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });

            res.status(200).json({ message: "Access token refreshed (web)" });
        } else {
            res.status(200).json({
                message: "Access token refreshed (mobile)",
                accessToken: newAccessToken,
            });
        }
    } catch (error) {
        console.error("Refresh Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// =============== [ VERIFY ACCESS TOKEN ] ===============
export const verifyAccessToken = async (
    req,
    res
) => {
    try {


        res.status(200).json({ valid: true, message: "Access token is valid" });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ valid: false, message: "Access token expired" });
        } else {
            res.status(401).json({ valid: false, message: "Invalid access token" });
        }
    }
};
// =============== [ VERIFY admin ACCESS TOKEN ] ===============

export const verifyadminAccessToken = async (
    req,
    res
) => {
    try {


        res.status(200).json({ valid: true, message: "admin Access token is valid" });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ valid: false, message: "Access token expired" });
        } else {
            res.status(401).json({ valid: false, message: "Invalid access token" });
        }
    }
}

export const AdminRefreshAccessToken = async (
    req,
    res
) => {
    try {
        const client = req.body.client || "web";
        let refreshToken;

        if (client === "web") {
            refreshToken = req.cookies?.refreshToken;
        } else {
            refreshToken = req.body.refreshToken || req.headers["authorization"]?.split(" ")[1];
        }

        if (!refreshToken) {
            res.status(401).json({ message: "No refresh token provided" });
            return;
        }

        const { valid, expired, decoded } = verifyRefreshToken(refreshToken);
        if (!valid || !decoded) {
            res.status(401).json({ message: expired ? "Refresh token expired" : "Invalid refresh token" });
            return;
        }

        // إنشاء Access Token جديد
        const newAccessToken = generateToken({ id: (decoded).id, role: "admin", email: (decoded).email });

        if (client === "web") {
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,

                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });

            res.status(200).json({ message: "Access token refreshed (web)" });
        } else {
            res.status(200).json({
                message: "Access token refreshed (mobile)",
                accessToken: newAccessToken,
            });
        }
    } catch (error) {
        console.error("Refresh Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// =============== [ LOGOUT USER ] ===============
export const logoutUser = async (req, res) => {
    try {
        const client = req.body.client || "web";

        if (client === "web") {
            // نمسح الكوكيز من المتصفح
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });

            res.status(200).json({ message: "Logged out successfully (web)" });
        } else {
            // للموبايل: السيرفر مش بيقدر يمسح من storage
            // هنا بس بنرجع رسالة، والـ client يمسح التوكنات عنده
            res.status(200).json({
                message: "Logged out successfully (mobile). Please remove tokens locally",
            });
        }
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
