const { google } = require('googleapis');
const ical = require('ical-generator');
const Booking = require('../models/booking.model');

// Google Calendar integration
const syncWithGoogleCalendar = async (booking, accessToken) => {
  const calendar = google.calendar({ version: 'v3', auth: accessToken });
  
  const event = {
    summary: `Booking for ${booking.property.title}`,
    description: `Booking ID: ${booking._id}`,
    start: { dateTime: booking.checkInDate, timeZone: 'UTC' },
    end: { dateTime: booking.checkOutDate, timeZone: 'UTC' },
    reminders: { useDefault: true }
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
    return response.data.htmlLink;
  } catch (err) {
    console.error('Google Calendar sync error:', err);
    throw new Error('Failed to sync with Google Calendar');
  }
};

// Generate iCal file for download
const generateICalFile = (booking) => {
  const cal = ical({ domain: 'bookingapp.com', name: 'Booking' });
  
  cal.createEvent({
    start: new Date(booking.checkInDate),
    end: new Date(booking.checkOutDate),
    summary: `Booking for ${booking.property.title}`,
    description: `Booking ID: ${booking._id}`,
    url: `${process.env.CLIENT_URL}/bookings/${booking._id}`
  });

  return cal.toString();
};

module.exports = {
  syncWithGoogleCalendar,
  generateICalFile
};