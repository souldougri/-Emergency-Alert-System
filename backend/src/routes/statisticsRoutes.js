const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  getDashboardStatistics,
  getGeographicalStatistics
} = require('../controllers/statisticsController');

const { authenticateToken } = require('../middleware/auth');

// All statistics routes require authentication

/**
 * @route   GET /api/statistics/dashboard
 * @desc    Get dashboard statistics (overview, status distribution, etc.)
 * @access  Private (Admin)
 * @query   timeRange? (1h, 24h, 7d, 30d)
 */
router.get('/dashboard', authenticateToken, getDashboardStatistics);

/**
 * @route   GET /api/statistics/geographical
 * @desc    Get geographical distribution of emergency requests
 * @access  Private (Admin)
 * @query   bounds? (JSON string with north, south, east, west properties)
 */
router.get('/geographical', authenticateToken, getGeographicalStatistics);

module.exports = router;
