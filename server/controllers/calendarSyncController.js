const asyncHandler = require('express-async-handler');
const { google } = require('googleapis');
const ical = require('ical-generator');
const Booking = require('../models/booking.model');

// @desc    Sync booking with Google Calendar
// @route   POST /api/calendar-sync/google
// @access  Private
const syncGoogleCalendar = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const { accessToken } = req.user; // Assume OAuth token is stored on user

  const booking = await Booking.findById(bookingId).populate('property');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  try {
    const calendar = google.calendar({ version: 'v3' });
    const event = {
      summary: `Booking: ${booking.property.title}`,
      location: booking.property.address,
      description: `Booking ID: ${booking._id}`,
      start: { dateTime: booking.checkInDate, timeZone: 'UTC' },
      end: { dateTime: booking.checkOutDate, timeZone: 'UTC' },
    };

    const response = await calendar.events.insert({
      auth: accessToken,
      calendarId: 'primary',
      resource: event
    });

    res.json({
      success: true,
      calendarLink: response.data.htmlLink
    });
  } catch (err) {
    console.error('Google Calendar sync failed:', err);
    res.status(400);
    throw new Error('Failed to sync with Google Calendar');
  }
});

// @desc    Generate iCal file for booking
// @route   GET /api/calendar-sync/ical/:bookingId
// @access  Private
const generateICalFile = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate('property');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const cal = ical({ domain: 'bookingapp.com', name: 'Booking' });
  cal.createEvent({
    start: new Date(booking.checkInDate),
    end: new Date(booking.checkOutDate),
    summary: `Booking: ${booking.property.title}`,
    description: `Booking ID: ${booking._id}`,
    url: `${process.env.CLIENT_URL}/bookings/${booking._id}`
  });

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename="booking.ics"');
  res.send(cal.toString());
});

module.exports = {
  syncGoogleCalendar,
  generateICalFile
};