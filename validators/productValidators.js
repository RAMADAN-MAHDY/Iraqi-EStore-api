import Joi from 'joi';

/* =========================
   Shared Messages
========================= */
const messages = {
  name: {
    'string.base': 'name must be a string',
    'string.min': 'name must be at least 2 characters (يجب أن يكون الاسم على الأقل 2 أحرف)',
    'string.max': 'name must be less than 20 characters (يجب أن يكون الاسم أقل من 20 حرفًا)',
    'any.required': 'name, price, category are mandatory (الاسم، السعر، الفئة مطلوبة)'
  },

  price: {
    'number.base': 'price must be a number',
    'number.greater': 'price must be greater than 0 and less than 1,000,000',
    'number.max': 'price must be greater than 0 and less than 1,000,000',
    'any.required': 'name, price, category are mandatory (الاسم، السعر، الفئة مطلوبة)'
  },

  discountedPrice: {
    'number.base': 'discountedPrice must be a number',
    'number.greater': 'discountedPrice must be greater than 0 and less than 1,000,000',
    'number.max': 'discountedPrice must be greater than 0 and less than 1,000,000'
  },

  discountPrice: {
    'number.base': 'discountPrice must be a number',
    'number.greater': 'discountPrice must be greater than 0 and less than 1,000,000',
    'number.max': 'discountPrice must be greater than 0 and less than 1,000,000'    
  }
};

/* =========================
   Base Product Fields
========================= */
const baseProductFields = {
  name: Joi.string().trim().min(2).max(20).messages(messages.name),

  price: Joi.number().greater(0).max(1_000_000).messages(messages.price),

  // Allow both fields, handle empty strings as undefined
  discountedPrice: Joi.number()
    .greater(0)
    .max(1_000_000)
    .allow(null, '')
    .messages(messages.discountedPrice),

  discountPrice: Joi.number()
    .greater(0)
    .max(1_000_000)
    .allow(null, '')
    .messages(messages.discountPrice),

  stock: Joi.number()
    .greater(0)
    .allow(null, '')
    .messages({
      'number.greater': 'stock must be greater than 0'
    }),

  discountActive: Joi.boolean().allow(null, '').default(false),

  category: Joi.string().hex().length(24).messages({
      'string.hex': 'Invalid Category ID',
      'string.length': 'Invalid Category ID length'
  }),

  weight: Joi.number()
    .greater(0)
    .max(1000)
    .allow(null, '')
    .messages({
      'number.greater': 'weight must be greater than 0 and less than 1000kg',
      'number.max': 'weight must be greater than 0 and less than 1000kg'    
    }),

  description: Joi.string()
    .min(2)
    .max(200)
    .allow(null, '')
    .messages({
      'string.min': 'description must be at least 2 characters (يجب أن يكون الوصف على الأقل 2 أحرف)', 
      'string.max': 'description must be less than 200 characters (يجب أن يكون الوصف أقل من 200 حرفًا)'
    })
};

/* =========================
   Create Product Schema
========================= */
export const createProductSchema = Joi.object({
  ...baseProductFields,
  name: baseProductFields.name.required(),
  price: baseProductFields.price.required(),
  category: baseProductFields.category.required()
}).options({ stripUnknown: true });

/* =========================
   Update Product Schema
========================= */
export const updateProductSchema = Joi.object(baseProductFields)
  .min(1) // Prevent empty updates
  .options({ stripUnknown: true });
