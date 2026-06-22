import mongoose from 'mongoose';
import { getModel } from '../utils/dbHelper.js';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Staff'],
    default: 'Staff'
  }
}, {
  timestamps: true
});

const UserModel = mongoose.model('User', UserSchema);
export default getModel('users', UserModel);
