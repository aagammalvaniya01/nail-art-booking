import express from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getBusySlots
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { superAdminOnly, adminOnly, staffOnly } from '../middleware/role.js';

const router = express.Router();

// Public routes
router.post('/', createBooking);
router.get('/busy-slots', getBusySlots);

// Hierarchical protected routes
router.get('/', protect, staffOnly, getBookings);                 // Staff, Admin, Super Admin can view
router.put('/:id', protect, adminOnly, updateBookingStatus);      // Admin and Super Admin can update
router.delete('/:id', protect, superAdminOnly, deleteBooking);   // Only Super Admin can delete

export default router;
