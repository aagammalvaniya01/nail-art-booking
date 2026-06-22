import mongoose from 'mongoose';
import { getModel } from '../utils/dbHelper.js';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  video: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const VideoModel = mongoose.model('Video', VideoSchema);
export default getModel('videos', VideoModel);
