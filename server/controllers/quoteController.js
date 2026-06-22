import Quote from '../models/Quote.js';
import { sendQuoteEmails } from '../utils/emailHelper.js';

// @desc    Submit a new custom quote request
// @route   POST /api/quotes
// @access  Public
export const createQuoteRequest = async (req, res) => {
  const { name, email, phone, serviceType, description, budget } = req.body;

  try {
    // Validation
    if (!name || !email || !phone || !serviceType || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, phone, serviceType, description, budget).'
      });
    }

    // Save to database (handles MongoDB or local JSON fallback)
    const newQuote = await Quote.create({
      name,
      email,
      phone,
      serviceType,
      description,
      budget
    });

    // Send emails (awaited to prevent Vercel container freeze before completion)
    try {
      const emailResult = await sendQuoteEmails({ name, email, phone, serviceType, description, budget });
      if (!emailResult.success) {
        console.error('[Quote Controller] Email send failed internally:', emailResult.error);
      }
    } catch (err) {
      console.error('[Quote Controller] Unhandled error sending emails:', err.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Your custom quote request has been submitted successfully!',
      data: newQuote
    });

  } catch (error) {
    console.error('Create custom quote request error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during custom quote submission. Please try again.'
    });
  }
};
