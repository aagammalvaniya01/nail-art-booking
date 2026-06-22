import mongoose from 'mongoose';
import { getModel } from '../utils/dbHelper.js';

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  slot: {
    type: String, // e.g. "10:00 AM"
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const BookingModel = mongoose.model('Booking', BookingSchema);
export default getModel('bookings', BookingModel);
