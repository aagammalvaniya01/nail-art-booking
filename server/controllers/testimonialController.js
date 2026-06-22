import Testimonial from '../models/Testimonial.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const reviews = await Testimonial.find({});
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json({ success: true, testimonials: sortedReviews });
  } catch (error) {
    console.error('Get testimonials error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching testimonials' });
  }
};

// @desc    Submit a testimonial review (Public / Admin)
// @route   POST /api/testimonials
// @access  Public
export const createTestimonial = async (req, res) => {
  const { name, review, rating, image } = req.body;

  try {
    if (!name || !review || !rating) {
      return res.status(400).json({ success: false, message: 'Please provide name, review, and rating' });
    }

    const newRating = Number(rating);
    if (newRating < 1 || newRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const newReview = await Testimonial.create({
      name,
      review,
      rating: newRating,
      image: image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      testimonial: newReview
    });
  } catch (error) {
    console.error('Create testimonial error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error saving testimonial' });
  }
};

// @desc    Update a testimonial review (Super Admin / Admin only)
// @route   PUT /api/testimonials/:id
// @access  Private
export const updateTestimonial = async (req, res) => {
  const { name, review, rating, image, visible } = req.body;

  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: name || t.name,
          review: review || t.review,
          rating: rating ? Number(rating) : t.rating,
          image: image || t.image,
          visible: visible !== undefined ? Boolean(visible) : t.visible
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully!',
      testimonial: updated
    });
  } catch (error) {
    console.error('Update testimonial error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating testimonial' });
  }
};

// @desc    Delete a testimonial (Super Admin / Admin only)
// @route   DELETE /api/testimonials/:id
// @access  Private
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    return res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting testimonial' });
  }
};
