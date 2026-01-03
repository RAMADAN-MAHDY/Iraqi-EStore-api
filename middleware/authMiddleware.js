import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET 

export const authMiddleware = (
    req,
    res,
    next
) => {
    try {
        // ناخد التوكن من الكوكيز أو من الـ headers
        let token;

        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken; // للويب
        } else if (req.headers["authorization"]) {
            const authHeader = req.headers["authorization"];
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1]; // للموبايل
            }
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized jwt" });
        }

        // نتحقق من التوكن
        const decoded = jwt.verify(token, secretKey);


        req.user = {
            userId: decoded.userId || decoded.id, // دعم للحالتين
            email: decoded.email,
            role: decoded.role || 'user', // نحط بيانات المستخدم في req.user مع دور افتراضي
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized jwt from catch" });
    }
};
