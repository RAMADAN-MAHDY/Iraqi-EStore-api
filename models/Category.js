import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [20, 'Category name must be at most 20 characters']
  },
  image: {
    type: String,
    required: false,
  }
}, {
  timestamps: true
});

export default mongoose.model('Category', CategorySchema);