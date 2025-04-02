const asyncHandler = require('express-async-handler');
const Booking = require('../models/booking.model');
const Property = require('../models/property.model');
const { calculateTotalPrice } = require('../utils/bookingUtils');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, checkInDate, checkOutDate, guests } = req.body;

  // Step 1: Validate property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Step 2: Validate availability
  const isAvailable = await checkAvailability(property, checkInDate, checkOutDate);
  if (!isAvailable) {
    res.status(400);
    throw new Error('Property not available for selected dates');
  }

  // Step 3: Validate guest count
  if (guests.adults > property.maxGuests) {
    res.status(400);
    throw new Error(`Property only allows ${property.maxGuests} guests`);
  }

  // Step 4: Calculate pricing
  const pricing = calculateTotalPrice(property, checkInDate, checkOutDate, guests);

  // Step 5: Create booking
  const booking = await Booking.create({
    user: req.user._id,
    property: propertyId,
    checkInDate,
    checkOutDate,
    guests,
    pricing,
    status: 'confirmed',
    paymentStatus: 'paid'
  });

  // Populate property and user details for email
  const bookingDetails = await Booking.findById(booking._id)
    .populate('property', 'title address')
    .populate('user', 'name email');

  // Send confirmation email
  await sendBookingConfirmation(bookingDetails);

  res.status(201).json({
    ...booking.toObject(),
    message: 'Booking confirmed! A confirmation has been sent to your email.'
  });
});

// Helper function to check availability
const checkAvailability = async (property, checkInDate, checkOutDate) => {
  // Implementation logic here
  return true; // Simplified for example
};
const Property = require('../models/property.model');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
// @desc    Get upcoming bookings
// @route   GET /api/bookings/upcoming
// @access  Private
const getUpcomingBookings = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookings = await Booking.find({ 
    user: req.user._id,
    checkInDate: { $gte: today },
    status: { $ne: 'cancelled' }
  })
  .populate({
    path: 'property',
    select: 'title images address',
    populate: {
      path: 'owner',
      select: 'name'
    }
  })
  .sort('checkInDate');

  const formattedBookings = bookings.map(booking => ({
    id: booking._id,
    property: {
      id: booking.property._id,
      title: booking.property.title,
      image: booking.property.images[0],
      address: booking.property.address,
      host: booking.property.owner.name
    },
    dates: {
      checkIn: booking.checkInDate,
      checkOut: booking.checkOutDate,
      nights: Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))
    },
    status: booking.status,
    totalPrice: booking.totalPrice
  }));

  res.json({
    count: formattedBookings.length,
    bookings: formattedBookings
  });
});

const getBookings = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const bookings = await Booking.find(filter)
    .populate({
      path: 'property',
      select: 'title pricePerNight images address',
      populate: {
        path: 'owner',
        select: 'name'
      }
    })
    .sort('-createdAt');

  const formattedBookings = bookings.map(booking => ({
    id: booking._id,
    property: {
      id: booking.property._id,
      title: booking.property.title,
      pricePerNight: booking.property.pricePerNight,
      mainImage: booking.property.images[0],
      address: booking.property.address,
      host: booking.property.owner.name
    },
    dates: {
      checkIn: booking.checkInDate,
      checkOut: booking.checkOutDate,
      nights: Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))
    },
    status: booking.status,
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt
  }));

  res.json({
    count: formattedBookings.length,
    bookings: formattedBookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property', 'title pricePerNight images')
    .populate('user', 'name email');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Verify booking belongs to user, user is property owner, or user is admin
  if (booking.user._id.toString() !== req.user._id.toString() && 
      booking.property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});


// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property', 'cancellationPolicy');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Verify booking belongs to user or user is admin
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this booking');
  }

  const { specialRequests, status, cancellationReason } = req.body;
  
  if (specialRequests) booking.specialRequests = specialRequests;
  
  if (status === 'cancelled') {
    // Handle cancellation
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancellationDate = new Date();
    
    // Calculate refund based on cancellation policy
    const daysUntilCheckIn = Math.ceil(
      (new Date(booking.checkInDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    
    if (booking.property.cancellationPolicy === 'flexible' || 
        daysUntilCheckIn > 7) {
      booking.refundAmount = booking.totalPrice * 0.9; // 90% refund
    } else if (daysUntilCheckIn > 3) {
      booking.refundAmount = booking.totalPrice * 0.5; // 50% refund
    } else {
      booking.refundAmount = 0; // No refund
    }
  } else if (status) {
    booking.status = status;
  }

  const updatedBooking = await booking.save();
  
  // Send cancellation email if applicable
  if (status === 'cancelled') {
    await sendCancellationConfirmation(updatedBooking);
  }

  res.json(updatedBooking);
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Verify booking belongs to user or user is admin
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this booking');
  }

  await booking.remove();
  res.json({ message: 'Booking removed' });
});

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
};