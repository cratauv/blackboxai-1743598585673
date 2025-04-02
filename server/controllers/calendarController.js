const asyncHandler = require('express-async-handler');
const Booking = require('../models/booking.model');

// @desc    Get property availability calendar
// @route   GET /api/calendar/:propertyId
// @access  Public
const getPropertyCalendar = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  let { year, month } = req.query;

  // Set default to current month if not provided
  const currentDate = new Date();
  year = year || currentDate.getFullYear();
  month = month || currentDate.getMonth() + 1;

  // Get first and last day of the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);

  // Get bookings for the property in this date range
  const bookings = await Booking.find({
    property: propertyId,
    status: { $ne: 'cancelled' },
    $or: [
      { checkInDate: { $lte: endDate, $gte: startDate } },
      { checkOutDate: { $lte: endDate, $gte: startDate } },
      { 
        checkInDate: { $lt: startDate },
        checkOutDate: { $gt: endDate }
      }
    ]
  });

  // Generate calendar days
  const daysInMonth = endDate.getDate();
  const calendar = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month - 1, day);
    let available = true;
    let bookingId = null;

    // Check if date is booked
    for (const booking of bookings) {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      
      if (currentDate >= checkIn && currentDate <= checkOut) {
        available = false;
        bookingId = booking._id;
        break;
      }
    }

    calendar.push({
      date: currentDate.toISOString().split('T')[0],
      day,
      available,
      bookingId
    });
  }

  res.json({
    propertyId,
    year,
    month,
    days: calendar
  });
});

module.exports = {
  getPropertyCalendar
};