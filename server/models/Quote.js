import mongoose from 'mongoose';
import { getModel } from '../utils/dbHelper.js';

const QuoteSchema = new mongoose.Schema({
  name: {
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
  phone: {
    type: String,
    required: true,
    trim: true
  },
  serviceType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  budget: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const QuoteModel = mongoose.model('Quote', QuoteSchema);
export default getModel('quotes', QuoteModel);
