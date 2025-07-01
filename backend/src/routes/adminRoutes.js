const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  loginAdmin,
  getAdminProfile,
  createAdmin,
  getAllAdmins,
  updateAdminStatus,
  verifyToken
} = require('../controllers/adminController');

const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');
const { validateAdminLogin, validateObjectId } = require('../middleware/validation');

// Public routes

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', validateAdminLogin, loginAdmin);

// Protected routes

/**
 * @route   GET /api/admin/verify
 * @desc    Verify JWT token
 * @access  Private (Admin)
 */
router.get('/verify', authenticateToken, verifyToken);

/**
 * @route   GET /api/admin/profile
 * @desc    Get current admin profile
 * @access  Private (Admin)
 */
router.get('/profile', authenticateToken, getAdminProfile);

// Super Admin only routes

/**
 * @route   POST /api/admin/create
 * @desc    Create new admin account
 * @access  Private (Super Admin)
 * @body    { email, password, name, role? }
 */
router.post('/create', authenticateToken, requireSuperAdmin, createAdmin);

/**
 * @route   GET /api/admin/all
 * @desc    Get all admin accounts
 * @access  Private (Super Admin)
 */
router.get('/all', authenticateToken, requireSuperAdmin, getAllAdmins);

/**
 * @route   PUT /api/admin/:id/status
 * @desc    Update admin account status (activate/deactivate)
 * @access  Private (Super Admin)
 * @params  id (MongoDB ObjectId)
 * @body    { isActive }
 */
router.put(
  '/:id/status',
  authenticateToken,
  requireSuperAdmin,
  validateObjectId,
  updateAdminStatus
);

module.exports = router;
