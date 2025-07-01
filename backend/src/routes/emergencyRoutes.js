const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateEmergencyRequestStatus
} = require('../controllers/emergencyController');

const { authenticateToken } = require('../middleware/auth');
const {
  validateEmergencyRequest,
  validateStatusUpdate,
  validateObjectId
} = require('../middleware/validation');

// Public routes (for mobile app)

/**
 * @route   POST /api/emergency/request
 * @desc    Create new emergency request
 * @access  Public
 * @body    { fullName, phoneNumber, location: { coordinates: [lng, lat] }, address? }
 */
router.post('/request', validateEmergencyRequest, createEmergencyRequest);

// Protected routes (for admin dashboard)

/**
 * @route   GET /api/emergency/requests
 * @desc    Get all emergency requests with filtering and pagination
 * @access  Private (Admin)
 * @query   status?, priority?, page?, limit?, sortBy?, sortOrder?
 */
router.get('/requests', authenticateToken, getAllEmergencyRequests);

/**
 * @route   GET /api/emergency/requests/:id
 * @desc    Get single emergency request by ID
 * @access  Private (Admin)
 * @params  id (MongoDB ObjectId)
 */
router.get('/requests/:id', authenticateToken, validateObjectId, getEmergencyRequestById);

/**
 * @route   PUT /api/emergency/requests/:id/status
 * @desc    Update emergency request status
 * @access  Private (Admin)
 * @params  id (MongoDB ObjectId)
 * @body    { status, notes?, assignedTo? }
 */
router.put(
  '/requests/:id/status',
  authenticateToken,
  validateObjectId,
  validateStatusUpdate,
  updateEmergencyRequestStatus
);

module.exports = router;
