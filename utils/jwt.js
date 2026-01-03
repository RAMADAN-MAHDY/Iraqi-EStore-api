import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET ; 
const refreshKey = process.env.REFRESH_TOKEN_SECRET ;


export const generateToken = (payload) =>
   jwt.sign(payload, secretKey ,{expiresIn :"15m"});




export const generateRefreshToken = (payload ) =>
    jwt.sign(payload, refreshKey, { expiresIn: '7d' });




export const verifyToken = (token) => {

  try {
    // console.log("Verifying Token:", token , secretKey);  
   const decoded =  jwt.verify(token, secretKey);
   return { valid: true, expired: false, decoded };
  } catch (error) {
 return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null,
    };
  }
}


export const verifyRefreshToken = (token) => {

  try {
   const decoded =  jwt.verify(token, refreshKey);
   return { valid: true, expired: false, decoded };
  } catch (error) {
 return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null,
    };
  }
}