import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters (يجب أن يكون الاسم على الأقل 2 أحرف)'],
    maxlength: [20, 'Name must be less than 20 characters (يجب أن يكون الاسم أقل من 20 حرفًا)'],
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be at least 0'],
    max: [1_000_000, 'Price must be less than 1,000,000']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price must be at least 0'],
    max: [1_000_000, 'Discount price must be less than 1,000,000']
  },
  discountPercent: {
    type: Number,   
    min: [0, 'Discount percent must be at least 0'],
    max: [100, 'Discount percent must be less than 100%']
  },
  discountActive: {
    type: Boolean,
    default: false,
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  stock: {
    type: Number,
    min: [0, 'Stock must be at least 0'],
    max: [1000, 'Stock must be less than 1,000']
  },
  image: {
    type: String,
    required: false
  },
  weight: {
    type: Number,
    min: [0, 'Weight must be at least 0 kg'],
    max: [1000, 'Weight must be less than 1,000 kg'],
    required: false // Make it optional for now, can be changed later if needed
  },
  description: {
    type: String,
    required: false,
    trim: true,
    minlength: [2, 'Description must be at least 2 characters (يجب أن يكون الوصف على الأقل 2 أحرف)'],
    maxlength: [200, 'Description must be less than 200 characters (يجب أن يكون الوصف أقل من 200 حرفًا)']
  }
}, {
  timestamps: true
});

ProductSchema.pre('save', function (next) {
  if (this.discountActive) {
    if (this.discountPercent == null && this.discountPrice == null) {
      return next(new Error('Discount is active but no discount value provided'));
    }

    if (this.discountPrice != null && this.discountPrice >= this.price) {
      return next(new Error('Discount price must be less than the original price'));
    }
  }
  next();
});



ProductSchema.index({ name: 'text' });


export default mongoose.model('Product', ProductSchema);