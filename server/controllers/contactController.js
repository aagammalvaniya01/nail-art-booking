import Contact from '../models/Contact.js';
import { sendContactEmails } from '../utils/emailHelper.js';

// @desc    Submit a new contact inquiry
// @route   POST /api/contacts
// @access  Public
export const createContactInquiry = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields (name, email, subject, message).' 
      });
    }

    // Save submission to database (handles MongoDB or local JSON fallback)
    const newInquiry = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });

    // Send emails (awaited to prevent Vercel container freeze before completion)
    try {
      const emailResult = await sendContactEmails({ name, email, phone, subject, message });
      if (!emailResult.success) {
        console.error('[Contact Controller] Email send failed internally:', emailResult.error);
      }
    } catch (err) {
      console.error('[Contact Controller] Unhandled error sending emails:', err.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully!',
      data: newInquiry
    });

  } catch (error) {
    console.error('Create contact inquiry error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during inquiry submission. Please try again.' 
    });
  }
};
