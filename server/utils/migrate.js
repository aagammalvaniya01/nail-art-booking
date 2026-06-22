import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import raw models (without proxy/fallback wrapper so we target the real MongoDB collections directly)
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Gallery from '../models/Gallery.js';
import Video from '../models/Video.js';
import Testimonial from '../models/Testimonial.js';
import Pricing from '../models/Pricing.js';
import About from '../models/About.js';

// Load unified root .env config
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

const migrate = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.includes('localhost')) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Please configure a valid MongoDB Atlas MONGO_URI in your .env file before running migration.');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB Atlas...`);
  try {
    // Override isMongoConnected to true so Mongoose doesn't use the fallback mechanism during migration
    global.isMongoConnected = true;

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('\x1b[32m%s\x1b[0m', 'Successfully connected to MongoDB Atlas!');
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `Failed to connect to MongoDB Atlas: ${err.message}`);
    console.log('Please ensure your username/password are correct in the .env file, and your IP address is whitelisted in your MongoDB Atlas Dashboard Database Access.');
    process.exit(1);
  }

  try {
    const dbPath = path.resolve('server/db.json');
    if (!fs.existsSync(dbPath)) {
      console.error('\x1b[31m%s\x1b[0m', 'Error: server/db.json not found!');
      process.exit(1);
    }

    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    console.log('Starting data migration from local db.json to MongoDB Atlas...');

    // 1. Users Migration
    if (dbData.users && dbData.users.length > 0) {
      console.log(`Migrating ${dbData.users.length} users...`);
      await User.deleteMany({});
      const cleanUsers = dbData.users.map(item => {
        const { _id, ...rest } = item;
        if (rest.username && !rest.name) {
          rest.name = rest.username;
          delete rest.username;
        }
        return rest;
      });
      await User.create(cleanUsers);
    }

    // 2. Bookings Migration
    if (dbData.bookings && dbData.bookings.length > 0) {
      console.log(`Migrating ${dbData.bookings.length} bookings...`);
      await Booking.deleteMany({});
      const cleanBookings = dbData.bookings.map(item => {
        const { _id, ...rest } = item;
        return rest;
      });
      await Booking.create(cleanBookings);
    }

    // 3. Gallery Migration
    if (dbData.gallery && dbData.gallery.length > 0) {
      console.log(`Migrating ${dbData.gallery.length} gallery items...`);
      await Gallery.deleteMany({});
      const cleanGallery = dbData.gallery.map(item => {
        const { _id, ...rest } = item;
        if (rest.imageUrl && !rest.image) {
          rest.image = rest.imageUrl;
          delete rest.imageUrl;
        }
        return rest;
      });
      await Gallery.create(cleanGallery);
    }

    // 4. Videos Migration
    if (dbData.videos && dbData.videos.length > 0) {
      console.log(`Migrating ${dbData.videos.length} videos...`);
      await Video.deleteMany({});
      const cleanVideos = dbData.videos.map(item => {
        const { _id, ...rest } = item;
        if (rest.videoUrl && !rest.video) {
          rest.video = rest.videoUrl;
          delete rest.videoUrl;
        }
        if (rest.thumbnailUrl && !rest.thumbnail) {
          rest.thumbnail = rest.thumbnailUrl;
          delete rest.thumbnailUrl;
        }
        return rest;
      });
      await Video.create(cleanVideos);
    }

    // 5. Testimonials Migration
    if (dbData.testimonials && dbData.testimonials.length > 0) {
      console.log(`Migrating ${dbData.testimonials.length} testimonials...`);
      await Testimonial.deleteMany({});
      const cleanTestimonials = dbData.testimonials.map(item => {
        const { _id, ...rest } = item;
        if (rest.customerName && !rest.name) {
          rest.name = rest.customerName;
          delete rest.customerName;
        }
        if (rest.photoUrl && !rest.image) {
          rest.image = rest.photoUrl;
          delete rest.photoUrl;
        }
        return rest;
      });
      await Testimonial.create(cleanTestimonials);
    }

    // 6. Pricing Migration
    if (dbData.pricing && dbData.pricing.length > 0) {
      console.log(`Migrating ${dbData.pricing.length} pricing packages...`);
      await Pricing.deleteMany({});
      const cleanPricing = dbData.pricing.map(item => {
        const { _id, ...rest } = item;
        return rest;
      });
      await Pricing.create(cleanPricing);
    }

    // 7. About Content Migration
    if (dbData.about && dbData.about.length > 0) {
      console.log(`Migrating ${dbData.about.length} about records...`);
      await About.deleteMany({});
      const cleanAbout = dbData.about.map(item => {
        const { _id, ...rest } = item;
        return rest;
      });
      await About.create(cleanAbout);
    }

    console.log('\x1b[32m%s\x1b[0m', 'Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Migration failed: ${error.message}`);
    process.exit(1);
  }
};

migrate();
