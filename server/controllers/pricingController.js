import Pricing from '../models/Pricing.js';

// @desc    Get all pricing packages
// @route   GET /api/pricing
// @access  Public
export const getPricing = async (req, res) => {
  try {
    const pricing = await Pricing.find({});
    return res.status(200).json({ success: true, pricing });
  } catch (error) {
    console.error('Get pricing error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching pricing' });
  }
};

// @desc    Create a new pricing package (Admin only)
// @route   POST /api/pricing
// @access  Private/Admin
export const createPricing = async (req, res) => {
  const { serviceName, price, features, description, category } = req.body;

  try {
    if (!serviceName || !price) {
      return res.status(400).json({ success: false, message: 'Please provide service name and price' });
    }

    const pricing = await Pricing.create({
      serviceName,
      price: Number(price),
      features: Array.isArray(features) ? features : [],
      description,
      category
    });

    return res.status(201).json({
      success: true,
      message: 'Pricing package added successfully!',
      pricing
    });
  } catch (error) {
    console.error('Create pricing error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating pricing package' });
  }
};

// @desc    Update a pricing package (Admin only)
// @route   PUT /api/pricing/:id
// @access  Private/Admin
export const updatePricing = async (req, res) => {
  const { serviceName, price, features, description, category } = req.body;

  try {
    const packageItem = await Pricing.findById(req.params.id);
    if (!packageItem) {
      return res.status(404).json({ success: false, message: 'Pricing package not found' });
    }

    const updated = await Pricing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          serviceName: serviceName || packageItem.serviceName,
          price: price !== undefined ? Number(price) : packageItem.price,
          features: Array.isArray(features) ? features : packageItem.features,
          description: description || packageItem.description,
          category: category || packageItem.category
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Pricing package updated successfully!',
      pricing: updated
    });
  } catch (error) {
    console.error('Update pricing error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating pricing package' });
  }
};

// @desc    Delete a pricing package (Admin only)
// @route   DELETE /api/pricing/:id
// @access  Private/Admin
export const deletePricing = async (req, res) => {
  try {
    const packageItem = await Pricing.findByIdAndDelete(req.params.id);
    if (!packageItem) {
      return res.status(404).json({ success: false, message: 'Pricing package not found' });
    }
    return res.status(200).json({ success: true, message: 'Pricing package deleted successfully' });
  } catch (error) {
    console.error('Delete pricing error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting pricing package' });
  }
};
