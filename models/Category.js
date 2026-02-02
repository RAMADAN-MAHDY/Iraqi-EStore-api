import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    max: 20
  },
  image: {
    type: String,
    required: false,
  }
}, {
  timestamps: true
});

export default mongoose.model('Category', CategorySchema);