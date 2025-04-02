const asyncHandler = require('express-async-handler');
const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Property = require('../models/property.model');

// @desc    Get booking analytics
// @route   GET /api/analytics/bookings
// @access  Private/Admin
const getBookingAnalytics = asyncHandler(async (req, res) => {
  const { period = 'month', propertyId } = req.query;
  const now = new Date();
  let startDate;

  switch(period) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  const match = { 
    createdAt: { $gte: startDate },
    ...(propertyId && { property: propertyId })
  };

  const analytics = await Booking.aggregate([
    { $match: match },
    { $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        avgBookingValue: { $avg: '$pricing.total' },
        byStatus: { $push: '$status' }
    }},
    { $project: {
        _id: 0,
        totalBookings: 1,
        totalRevenue: 1,
        avgBookingValue: 1,
        statusDistribution: {
          $reduce: {
            input: '$byStatus',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$$value',
                { [$$this]: { $add: [1, { $ifNull: ['$$value.$$this', 0] }] } }
              ]
            }
          }
        }
    }}
  ]);

  res.json(analytics[0] || {});
});

// @desc    Get user activity analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
  const userCounts = await User.aggregate([
    { $group: {
        _id: null,
        total: { $sum: 1 },
        verified: { $sum: { $cond: ['$verified', 1, 0] } },
        active: { $sum: { $cond: ['$isActive', 1, 0] } },
        admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }
    }}
  ]);

  const recentUsers = await User.find()
    .sort('-createdAt')
    .limit(5)
    .select('name email role createdAt lastLogin');

  res.json({
    counts: userCounts[0] || {},
    recentUsers
  });
});

// @desc    Get property performance analytics
// @route   GET /api/analytics/properties
// @access  Private/Admin
const getPropertyAnalytics = asyncHandler(async (req, res) => {
  const topProperties = await Booking.aggregate([
    { $group: {
        _id: '$property',
        bookingCount: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' }
    }},
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
    { $lookup: {
        from: 'properties',
        localField: '_id',
        foreignField: '_id',
        as: 'property'
    }},
    { $unwind: '$property' },
    { $project: {
        propertyId: '$_id',
        propertyTitle: '$property.title',
        bookingCount: 1,
        totalRevenue: 1,
        _id: 0
    }}
  ]);

  res.json(topProperties);
});

module.exports = {
  getBookingAnalytics,
  getUserAnalytics,
  getPropertyAnalytics
};