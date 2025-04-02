const asyncHandler = require('express-async-handler');
const Notification = require('../models/notification.model');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort('-createdAt')
    .limit(50);
  
  res.json(notifications);
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, link, metadata } = req.body;

  const notification = await Notification.create({
    user: req.user._id,
    title,
    message,
    type,
    link,
    metadata
  });

  // Emit real-time notification
  req.io.to(req.user._id.toString()).emit('notification', notification);

  res.status(201).json(notification);
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json(notification);
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.json({ message: 'All notifications marked as read' });
});

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead
};