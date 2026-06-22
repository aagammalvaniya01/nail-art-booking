import mongoose from 'mongoose';
import { getModel } from '../utils/dbHelper.js';

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  review: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  image: {
    type: String
  },
  visible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const TestimonialModel = mongoose.model('Testimonial', TestimonialSchema);
export default getModel('testimonials', TestimonialModel);
