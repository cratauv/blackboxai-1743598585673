const nodemailer = require('nodemailer');
const { 
  bookingConfirmationTemplate,
  bookingCancellationTemplate,
  bookingReminderTemplate 
} = require('./emailTemplates');
const Booking = require('../models/booking.model');

const sendBookingConfirmation = async (booking) => {
  const template = bookingConfirmationTemplate(booking);
  await sendEmail({
    email: booking.user.email,
    subject: template.subject,
    html: template.html
  });
};

const sendBookingCancellation = async (booking) => {
  const template = bookingCancellationTemplate(booking);
  await sendEmail({
    email: booking.user.email,
    subject: template.subject,
    html: template.html
  });
};

const sendBookingReminder = async (booking) => {
  const template = bookingReminderTemplate(booking);
  await sendEmail({
    email: booking.user.email,
    subject: template.subject,
    html: template.html
  });
};

// Schedule reminders for upcoming bookings
const scheduleBookingReminders = async () => {
  const upcomingBookings = await Booking.find({
    checkInDate: { 
      $gte: new Date(),
      $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Next 3 days
    },
    status: 'confirmed'
  }).populate('property').populate('user');

  for (const booking of upcomingBookings) {
    await sendBookingReminder(booking);
  }
};


const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define email options
  const mailOptions = {
    from: 'Booking App <noreply@bookingapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendBookingCancellation,
  sendBookingReminder,
  scheduleBookingReminders
};
