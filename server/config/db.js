import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

global.isMongoConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/nail-art-booking';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000, // Timeout after 3 seconds so we fail fast to fallback
    });
    global.isMongoConnected = true;
    console.log(`\x1b[32m%s\x1b[0m`, `[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    global.isMongoConnected = false;
    console.log(`\x1b[33m%s\x1b[0m`, `[Database Warning] Could not connect to MongoDB: ${error.message}`);
    console.log(`\x1b[36m%s\x1b[0m`, `[Database Fallback] Starting application with local JSON database fallback (server/db.json).`);
  }
};
