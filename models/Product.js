import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', ProductSchema);