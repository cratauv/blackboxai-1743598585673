const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Get all notifications for user
router.route('/')
  .get(protect, getNotifications)
  .post(protect, createNotification);

// Mark notification as read
router.route('/:id/read')
  .patch(protect, markAsRead);

// Mark all notifications as read
router.route('/read-all')
  .patch(protect, markAllAsRead);

module.exports = router;