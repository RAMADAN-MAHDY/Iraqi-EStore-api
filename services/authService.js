import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const registerUser = async (name, email, phone, password, role) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid user data');
  }
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

export const getUserProfile = async (id) => {
  const user = await User.findById(id).select('-password');

  if (user) {
    return user;
  } else {
    throw new Error('User not found');
  }
};

export const sendOtp = async (phone) => {
  try {
    const verification = await twilioClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({ to: phone, channel: 'sms' });

      console.log('OTP sent to:', verification.sid);
      console.log('OTP sent to:', verification);
    return verification.sid;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

export const verifyOtp = async (phone, otpCode) => {
  try {
    const verificationCheck = await twilioClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks
      .create({ to: phone, code: otpCode });
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};

export const loginWithPhone = async (phone) => {
  const user = await User.findOne({ phone });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('User not found');
  }
};