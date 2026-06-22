import Booking from '../models/Booking.js';
import { sendBookingEmails } from '../utils/emailHelper.js';

// @desc    Create a new booking slot
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  const { name, phone, email, service, date, slot, message } = req.body;

  try {
    if (!name || !phone || !email || !service || !date || !slot) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Double Booking Prevention
    const existingBookings = await Booking.find({ date, slot });
    const activeBooking = existingBookings.find(booking => booking.status !== 'Cancelled');

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: 'This date and time slot is already reserved. Please select a different slot.'
      });
    }

    const booking = await Booking.create({
      name,
      phone,
      email,
      service,
      date,
      slot,
      message,
      status: 'Pending'
    });

    // Send emails (awaited to prevent Vercel container freeze before completion)
    try {
      const emailResult = await sendBookingEmails({
        name,
        phone,
        email,
        service,
        date,
        slot,
        message,
        status: 'Pending'
      });
      if (!emailResult.success) {
        console.error('[Booking Controller] Email send failed internally:', emailResult.error);
      }
    } catch (err) {
      console.error('[Booking Controller] Error sending booking emails:', err.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully!',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during booking creation' });
  }
};

// @desc    Get all bookings (Admin/Super Admin/Staff)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    const sortedBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json({ success: true, bookings: sortedBookings });
  } catch (error) {
    console.error('Get bookings error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
};

// @desc    Update booking status (Super Admin / Admin only)
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating booking' });
  }
};

// @desc    Delete booking (Super Admin only)
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting booking' });
  }
};

// @desc    Get busy time slots for a specific date
// @route   GET /api/bookings/busy-slots
// @access  Public
export const getBusySlots = async (req, res) => {
  const { date } = req.query;

  try {
    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide a date query parameter' });
    }

    const bookings = await Booking.find({ date });
    const busySlots = bookings
      .filter(booking => booking.status !== 'Cancelled')
      .map(booking => booking.slot);

    return res.status(200).json({ success: true, busySlots });
  } catch (error) {
    console.error('Get busy slots error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching slot details' });
  }
};
