import express from 'express';
import { createContactInquiry } from '../controllers/contactController.js';

const router = express.Router();

// Public route to submit contact form
router.post('/', createContactInquiry);

export default router;
