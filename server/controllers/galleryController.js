import path from 'path';
import fs from 'fs';
import Gallery from '../models/Gallery.js';

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find({});
    return res.status(200).json({ success: true, gallery: items });
  } catch (error) {
    console.error('Get gallery error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching gallery' });
  }
};

// @desc    Create a new gallery item (Super Admin / Admin only)
// @route   POST /api/gallery
// @access  Private
export const createGalleryItem = async (req, res) => {
  const { title, description, price, category, image: bodyImage } = req.body;

  try {
    if (!title || !description || !price || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let image = bodyImage || '';

    // Handle Local File Upload
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileExt = path.extname(file.name);
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}${fileExt}`;
      const uploadDir = path.resolve('server/uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, fileName);
      await file.mv(uploadPath);
      image = `/uploads/${fileName}`;
    }

    if (!image) {
      return res.status(400).json({ success: false, message: 'Please upload an image file or provide an image URL' });
    }

    const item = await Gallery.create({
      title,
      description,
      price: Number(price),
      image,
      category
    });

    return res.status(201).json({
      success: true,
      message: 'Gallery item added successfully!',
      item
    });
  } catch (error) {
    console.error('Create gallery item error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating gallery item' });
  }
};

// @desc    Update a gallery item (Super Admin / Admin only)
// @route   PUT /api/gallery/:id
// @access  Private
export const updateGalleryItem = async (req, res) => {
  const { title, description, price, category, image: bodyImage } = req.body;

  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    let image = bodyImage || item.image;

    // Handle Local File Upload
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileExt = path.extname(file.name);
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}${fileExt}`;
      const uploadDir = path.resolve('server/uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = path.join(uploadDir, fileName);
      await file.mv(uploadPath);

      // Delete old local file
      if (item.image && item.image.startsWith('/uploads/')) {
        const oldPath = path.resolve('server', item.image.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      image = `/uploads/${fileName}`;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: title || item.title,
          description: description || item.description,
          price: price ? Number(price) : item.price,
          category: category || item.category,
          image
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully!',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update gallery item error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating gallery item' });
  }
};

// @desc    Delete a gallery item (Super Admin only)
// @route   DELETE /api/gallery/:id
// @access  Private
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    if (item.image && item.image.startsWith('/uploads/')) {
      const filePath = path.resolve('server', item.image.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery item error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting gallery item' });
  }
};
