import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { protect } from '../middleware/auth.js';
import { superAdminOnly } from '../middleware/role.js';

const router = express.Router();

// Public routes
router.get('/', getAbout);

// Protected routes (Super Admin only can update salon description content)
router.put('/', protect, superAdminOnly, updateAbout);

export default router;
