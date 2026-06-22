import express from 'express';
import { getVideos, createVideo, deleteVideo } from '../controllers/videoController.js';
import { protect } from '../middleware/auth.js';
import { superAdminOnly, adminOnly } from '../middleware/role.js';

const router = express.Router();

// Public routes
router.get('/', getVideos);

// Protected routes
router.post('/', protect, adminOnly, createVideo);            // Admin and Super Admin can create
router.delete('/:id', protect, superAdminOnly, deleteVideo); // Only Super Admin can delete

export default router;
