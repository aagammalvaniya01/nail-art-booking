import mongoose from 'mongoose';
import { getModel } from '../utils/dbHelper.js';

const AboutSchema = new mongoose.Schema({
  salonIntro: {
    type: String,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  experienceYears: {
    type: Number,
    default: 5
  },
  whyChooseUs: {
    type: [String],
    default: []
  },
  address: {
    type: String,
    default: 'Pushkar valley, NewIndia Colony, Nikol'
  },
  phone: {
    type: String,
    default: '8141464492'
  },
  email: {
    type: String,
    default: 'rutvivasani26@gmail.com'
  },
  hours: {
    type: String,
    default: '9AM to 9PM all days'
  }
}, {
  timestamps: true
});

const AboutModel = mongoose.model('About', AboutSchema);
export default getModel('about', AboutModel);
