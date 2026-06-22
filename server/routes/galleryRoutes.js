import express from 'express';
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';
import { superAdminOnly, adminOnly } from '../middleware/role.js';

const router = express.Router();

// Public routes
router.get('/', getGallery);

// Protected routes
router.post('/', protect, adminOnly, createGalleryItem);       // Admin and Super Admin can create
router.put('/:id', protect, adminOnly, updateGalleryItem);     // Admin and Super Admin can edit
router.delete('/:id', protect, superAdminOnly, deleteGalleryItem); // Only Super Admin can delete

export default router;
