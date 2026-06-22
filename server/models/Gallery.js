import mongoose from 'mongoose';
import { getModel } from '../utils/dbHelper.js';

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const GalleryModel = mongoose.model('Gallery', GallerySchema);
export default getModel('gallery', GalleryModel);
