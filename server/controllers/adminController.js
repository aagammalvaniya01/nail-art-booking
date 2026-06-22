import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// @desc    Get all administrative users (Super Admin only)
// @route   GET /api/admins
// @access  Private/SuperAdmin
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['Super Admin', 'Admin', 'Staff'] } })
      .select('-password'); // Exclude password hashes
    return res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error('Get admins error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching admins' });
  }
};

// @desc    Create a new administrative user (Super Admin only)
// @route   POST /api/admins
// @access  Private/SuperAdmin
export const createAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (!['Super Admin', 'Admin', 'Staff'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid administrative role' });
    }

    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully!',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating admin account' });
  }
};

// @desc    Update administrative user (Super Admin only)
// @route   PUT /api/admins/:id
// @access  Private/SuperAdmin
export const updateAdmin = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    // Role validations
    if (role && !['Super Admin', 'Admin', 'Staff'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid administrative role' });
    }

    // Prevent changing own role (to prevent locking out)
    if (req.user.id === req.params.id && role && role !== admin.role) {
      return res.status(400).json({ success: false, message: 'You cannot change your own administrative role' });
    }

    const updateData = {
      name: name || admin.name,
      email: email || admin.email,
      role: role || admin.role
    };

    // If password update is requested
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Admin account updated successfully!',
      admin: updatedAdmin
    });
  } catch (error) {
    console.error('Update admin error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating admin account' });
  }
};

// @desc    Delete administrative user (Super Admin only)
// @route   DELETE /api/admins/:id
// @access  Private/SuperAdmin
export const deleteAdmin = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own administrative account' });
    }

    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    // Prevent deleting the last Super Admin
    if (admin.role === 'Super Admin') {
      const superAdminCount = await User.countDocuments({ role: 'Super Admin' });
      if (superAdminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the last remaining Super Admin' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Admin account deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting admin account' });
  }
};
