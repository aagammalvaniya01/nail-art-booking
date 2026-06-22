import mongoose from 'mongoose';
import { getModel } from '../utils/dbHelper.js';

const PricingSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  features: {
    type: [String], // Array of features, e.g. ["Cuticle care", "Gel Polish", "Single nail art"]
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true // e.g. Basic, Premium, Bridal, Custom
  }
}, {
  timestamps: true
});

const PricingModel = mongoose.model('Pricing', PricingSchema);
export default getModel('pricing', PricingModel);
