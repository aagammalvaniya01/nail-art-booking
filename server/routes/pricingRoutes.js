import express from 'express';
import {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing
} from '../controllers/pricingController.js';
import { protect } from '../middleware/auth.js';
import { superAdminOnly } from '../middleware/role.js';

const router = express.Router();

// Public routes
router.get('/', getPricing);

// Protected routes (Super Admin only can manage pricing packages)
router.post('/', protect, superAdminOnly, createPricing);
router.put('/:id', protect, superAdminOnly, updatePricing);
router.delete('/:id', protect, superAdminOnly, deletePricing);

export default router;
