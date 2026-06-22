import express from 'express';
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { superAdminOnly } from '../middleware/role.js';

const router = express.Router();

// Apply Super Admin only protection to all admin routes
router.use(protect);
router.use(superAdminOnly);

router.get('/', getAdmins);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

export default router;
