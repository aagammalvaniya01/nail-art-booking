import express from 'express';
import { createQuoteRequest } from '../controllers/quoteController.js';

const router = express.Router();

// Public route to submit quote request
router.post('/', createQuoteRequest);

export default router;
