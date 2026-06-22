import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Load routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';

// Load configuration from unified root .env file
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable file uploads
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  abortOnLimit: true
}));

// Serve static upload files
app.use('/uploads', express.static(path.join(__dirname, 'server/uploads')));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/quotes', quoteRoutes);

// Serve static Next.js production export files if present
if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, '.next'))) {
  app.use(express.static(path.join(__dirname, 'out'))); // or build folder
}

// Simple API status check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    databaseFallback: !global.isMongoConnected
  });
});

// Global error handling middleware (handles JSON parsing SyntaxErrors, etc.)
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
  }
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `[Server] Running on port ${PORT} with unified root .env config.`);
});
