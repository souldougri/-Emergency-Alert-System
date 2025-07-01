const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated. Please contact system administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate JWT token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
};

// Get current admin profile
const getAdminProfile = async (req, res) => {
  try {
    // req.admin is set by authenticateToken middleware
    res.json({
      success: true,
      data: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin,
        createdAt: req.admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: 'Internal server error'
    });
  }
};

// Create new admin (super admin only)
const createAdmin = async (req, res) => {
  try {
    const { email, password, name, role = 'admin' } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (existingAdmin) {
      return res.status(400).json({
        error: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      role
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Failed to create admin',
      message: 'Internal server error'
    });
  }
};

// Get all admins (super admin only)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: admins
    });

  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      error: 'Failed to fetch admins',
      message: 'Internal server error'
    });
  }
};

// Update admin status (super admin only)
const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent super admin from deactivating themselves
    if (id === req.admin._id.toString() && isActive === false) {
      return res.status(400).json({
        error: 'Cannot deactivate your own account'
      });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({
        error: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin status updated successfully',
      data: updatedAdmin
    });

  } catch (error) {
    console.error('Error updating admin status:', error);
    res.status(500).json({
      error: 'Failed to update admin status',
      message: 'Internal server error'
    });
  }
};

// Verify token (for frontend token validation)
const verifyToken = async (req, res) => {
  try {
    // If we reach here, token is valid (middleware already verified it)
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        admin: {
          id: req.admin._id,
          email: req.admin.email,
          name: req.admin.name,
          role: req.admin.role
        }
      }
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({
      error: 'Token verification failed',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  createAdmin,
  getAllAdmins,
  updateAdminStatus,
  verifyToken
};
