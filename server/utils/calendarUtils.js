const Booking = require('../models/booking.model');

// Generate availability calendar for a property
const getAvailabilityCalendar = async (propertyId, year, month) => {
  // Get first and last day of the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);

  // Get all bookings for this property in date range
  const bookings = await Booking.find({
    property: propertyId,
    $or: [
      { checkInDate: { $lte: endDate, $gte: startDate } },
      { checkOutDate: { $lte: endDate, $gte: startDate } },
      { 
        checkInDate: { $lt: startDate },
        checkOutDate: { $gt: endDate }
      }
    ],
    status: { $ne: 'cancelled' }
  });

  // Initialize calendar
  const daysInMonth = endDate.getDate();
  const calendar = Array(daysInMonth).fill().map((_, i) => ({
    day: i + 1,
    available: true,
    bookedBy: null
  }));

  // Mark unavailable dates
  bookings.forEach(booking => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      if (currentDate >= checkIn && currentDate <= checkOut) {
        calendar[day - 1].available = false;
        calendar[day - 1].bookedBy = booking.user;
      }
    }
  });

  return {
    year,
    month,
    propertyId,
    days: calendar
  };
};

module.exports = {
  getAvailabilityCalendar
};