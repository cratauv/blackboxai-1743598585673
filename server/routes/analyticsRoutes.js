const express = require('express');
const router = express.Router();
const {
  getBookingAnalytics,
  getUserAnalytics,
  getPropertyAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/bookings', protect, authorize('admin'), getBookingAnalytics);
router.get('/users', protect, authorize('admin'), getUserAnalytics);
router.get('/properties', protect, authorize('admin'), getPropertyAnalytics);

module.exports = router;