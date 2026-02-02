import Joi from 'joi';

export const registerSchema = Joi.object({
    username: Joi.string().trim().min(5).max(20).required().messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 5 characters',
        'string.max': 'Username must be at most 20 characters',
        'any.required': 'Username is required'
    }),
    email: Joi.string().trim().lowercase().email().min(6).max(100).required().messages({
        'string.email': 'Invalid email format',
        'string.min': 'Email length must be between 6 and 100 characters',
        'string.max': 'Email length must be between 6 and 100 characters',
        'any.required': 'Email is required'
    }),
    phone: Joi.string().trim().required().messages({
        'any.required': 'Phone number is required'
    }),
    password: Joi.string().trim().min(6).max(12).required().messages({
        'string.min': 'Password must be between 6 and 12 characters',
        'string.max': 'Password must be between 6 and 12 characters',
        'any.required': 'Password is required'
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(12).required().messages({
        'string.min': 'Password must be between 6 and 12 characters',
        'string.max': 'Password must be between 6 and 12 characters',
        'any.required': 'Password is required'
    }),
    client: Joi.string().valid('web', 'mobile').default('web'),
});

export const loginAdminSchema = Joi.object({
    email: Joi.string().trim().required().custom((value, helpers) => {
        if (!value.includes('@')) {
            return helpers.message('Email must contain @ symbol');
        }
        return value;
    }).messages({
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(12).required().messages({
        'string.min': 'Password must be between 6 and 12 characters',
        'string.max': 'Password must be between 6 and 12 characters',
        'any.required': 'Password is required'
    }),
    client: Joi.string().valid('web', 'mobile').default('web'),
});

export const sendOtpSchema = Joi.object({
    phone: Joi.string().required().messages({
        'any.required': 'Phone number is required'
    }),
});

export const verifyOtpSchema = Joi.object({
    phone: Joi.string().required().messages({
        'any.required': 'Phone number is required'
    }),
    otpCode: Joi.string().required().messages({
        'any.required': 'OTP code is required'
    }),
    client: Joi.string().valid('web', 'mobile').default('web'),
});

export const googleAuthSchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Token is required'
    }),
    client: Joi.string().valid('web', 'mobile').default('web'),
});
