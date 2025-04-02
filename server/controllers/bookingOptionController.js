const asyncHandler = require('express-async-handler');
const BookingOption = require('../models/bookingOption.model');

// @desc    Get all booking options
// @route   GET /api/booking-options
// @access  Private/Admin
const getBookingOptions = asyncHandler(async (req, res) => {
  const options = await BookingOption.find({});
  
  // Convert prices if user has currency preference
  if (req.user?.currencyPreference) {
    const convertedOptions = options.map(option => {
      const convertedPrice = convertCurrency(
        option.price, 
        option.currency, 
        req.user.currencyPreference
      );
      return {
        ...option.toObject(),
        displayPrice: convertedPrice,
        displayCurrency: req.user.currencyPreference
      };
    });
    return res.json(convertedOptions);
  }

  res.json(options);
});

// Simple currency conversion - would integrate with real API in production
function convertCurrency(amount, fromCurrency, toCurrency) {
  const rates = {
    USD: { EUR: 0.85, GBP: 0.73, JPY: 110, CAD: 1.25 },
    EUR: { USD: 1.18, GBP: 0.86, JPY: 130, CAD: 1.47 },
    GBP: { USD: 1.37, EUR: 1.16, JPY: 151, CAD: 1.71 },
    JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, CAD: 0.011 },
    CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 88 }
  };

  if (fromCurrency === toCurrency) return amount;
  return amount * (rates[fromCurrency]?.[toCurrency] || 1);
}

// @desc    Create new booking option
// @route   POST /api/booking-options
// @access  Private/Admin
const createBookingOption = asyncHandler(async (req, res) => {
  const { name, description, price, type } = req.body;

  const optionExists = await BookingOption.findOne({ name });
  if (optionExists) {
    res.status(400);
    throw new Error('Booking option already exists');
  }

  const option = await BookingOption.create({
    name,
    description,
    price,
    type
  });

  res.status(201).json(option);
});

// @desc    Update booking option
// @route   PUT /api/booking-options/:id
// @access  Private/Admin
const updateBookingOption = asyncHandler(async (req, res) => {
  const option = await BookingOption.findById(req.params.id);

  if (!option) {
    res.status(404);
    throw new Error('Booking option not found');
  }

  option.name = req.body.name || option.name;
  option.description = req.body.description || option.description;
  option.price = req.body.price || option.price;
  option.type = req.body.type || option.type;
  option.isActive = req.body.isActive !== undefined ? req.body.isActive : option.isActive;

  const updatedOption = await option.save();
  res.json(updatedOption);
});

// @desc    Delete booking option
// @route   DELETE /api/booking-options/:id
// @access  Private/Admin
const deleteBookingOption = asyncHandler(async (req, res) => {
  const option = await BookingOption.findById(req.params.id);

  if (!option) {
    res.status(404);
    throw new Error('Booking option not found');
  }

  await option.remove();
  res.json({ message: 'Booking option removed' });
});

// @desc    Add review to booking option
// @route   POST /api/booking-options/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, language = 'en' } = req.body;

  const option = await BookingOption.findById(req.params.id);
  if (!option) {
    res.status(404);
    throw new Error('Booking option not found');
  }

  const alreadyReviewed = option.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this option');
  }

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
    language
  };

  option.reviews.push(review);
  option.reviewCount = option.reviews.length;
  await option.updateAverageRating();
  await option.save();

  res.status(201).json({ message: 'Review added' });
});

// @desc    Get reviews for booking option
// @route   GET /api/booking-options/:id/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const option = await BookingOption.findById(req.params.id).populate('reviews.user', 'name email');
  
  if (!option) {
    res.status(404);
    throw new Error('Booking option not found');
  }

  // Only return approved reviews for non-admins
  const reviews = req.user?.isAdmin 
    ? option.reviews
    : option.reviews.filter(r => r.status === 'approved');

  res.json(reviews);
});

// @desc    Get pending reviews (admin only)
// @route   GET /api/booking-options/reviews/pending
// @access  Private/Admin
const getPendingReviews = asyncHandler(async (req, res) => {
  const options = await BookingOption.find({
    'reviews.status': 'pending'
  }).populate('reviews.user', 'name email');

  const pendingReviews = options.flatMap(option => 
    option.reviews.filter(r => r.status === 'pending')
      .map(r => ({ ...r.toObject(), bookingOptionId: option._id }))
  );

  res.json(pendingReviews);
});

// @desc    Search reviews with filters
// @route   GET /api/booking-options/reviews/search
// @access  Public
const searchReviews = asyncHandler(async (req, res) => {
  const { 
    minRating, 
    maxRating,
    startDate,
    endDate,
    type,
    location,
    status,
    userId,
    searchText,
    language
  } = req.query;

  let query = {};

  // Rating filter
  if (minRating || maxRating) {
    query['reviews.rating'] = {};
    if (minRating) query['reviews.rating'].$gte = Number(minRating);
    if (maxRating) query['reviews.rating'].$lte = Number(maxRating);
  }

  // Date filter
  if (startDate || endDate) {
    query['reviews.createdAt'] = {};
    if (startDate) query['reviews.createdAt'].$gte = new Date(startDate);
    if (endDate) query['reviews.createdAt'].$lte = new Date(endDate);
  }

  // Booking option type filter
  if (type) {
    query.type = type;
  }

  // Location filter (if available in model)
  if (location) {
    query.location = new RegExp(location, 'i');
  }

  // Status filter (admin only)
  if (status && req.user?.isAdmin) {
    query['reviews.status'] = status;
  }

  // User filter
  if (userId) {
    query['reviews.user'] = userId;
  }

  // Text search in comments
  if (searchText) {
    query['reviews.comment'] = new RegExp(searchText, 'i');
  }

  // Language filter
  if (language) {
    query['reviews.language'] = language;
  }

  const options = await BookingOption.find(query)
    .populate('reviews.user', 'name email')
    .select('name type reviews');

  // Filter approved reviews for non-admins
  const reviews = options.flatMap(option => 
    option.reviews
      .filter(r => req.user?.isAdmin ? true : r.status === 'approved')
      .map(r => ({
        ...r.toObject(),
        bookingOptionName: option.name,
        bookingOptionType: option.type
      }))
  );

  res.json(reviews);
});

// @desc    Moderate review (admin only)
// @route   PUT /api/booking-options/:optionId/reviews/:reviewId/moderate
// @access  Private/Admin
const moderateReview = asyncHandler(async (req, res) => {
  const { optionId, reviewId } = req.params;
  const { status } = req.body;

  const option = await BookingOption.findById(optionId);
  if (!option) {
    res.status(404);
    throw new Error('Booking option not found');
  }

  const review = option.reviews.id(reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.status = status;
  review.moderatedBy = req.user._id;
  review.moderatedAt = new Date();

  await option.save();
  await option.updateAverageRating();

  res.json({ message: 'Review moderated successfully' });
});

module.exports = {
  getBookingOptions,
  createBookingOption,
  updateBookingOption,
  deleteBookingOption,
  addReview,
  getReviews,
  getPendingReviews,
  moderateReview,
  searchReviews
};
