const asyncHandler = require('express-async-handler');
const Property = require('../models/property.model');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  // Basic filtering
  const queryObj = {...req.query};
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  let query = Property.find(JSON.parse(queryStr));

  // Search
  if (req.query.search) {
    query = query.find({ 
      $text: { $search: req.query.search } 
    }, {
      score: { $meta: "textScore" }
    }).sort({
      score: { $meta: "textScore" }
    });
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const properties = await query;
  res.json({
    results: properties.length,
    page,
    data: properties
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('owner', 'name email phone')
    .populate('reviews');

  if (property) {
    // Calculate total price with fees
    const totalPrice = {
      basePrice: property.pricePerNight,
      cleaningFee: property.cleaningFee || 0,
      serviceFee: Math.round(property.pricePerNight * 0.12), // 12% service fee
      taxes: Math.round(property.pricePerNight * 0.08) // 8% tax
    };
    totalPrice.total = totalPrice.basePrice + totalPrice.cleaningFee + 
                      totalPrice.serviceFee + totalPrice.taxes;

    res.json({
      ...property.toObject(),
      pricing: totalPrice,
      availability: property.availability.filter(a => !a.isBlocked)
    });
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private
const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    propertyType,
    location,
    amenities,
    bedrooms,
    bathrooms,
    maxGuests,
    pricePerNight,
    cleaningFee,
    images,
    availability,
    houseRules,
    cancellationPolicy
  } = req.body;

  const property = await Property.create({
    owner: req.user._id,
    title,
    description,
    propertyType,
    location,
    amenities,
    bedrooms,
    bathrooms,
    maxGuests,
    pricePerNight,
    cleaningFee,
    images,
    availability,
    houseRules,
    cancellationPolicy
  });

  res.status(201).json(property);
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    // Verify property owner
    if (property.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this property');
    }

    // Update fields
    property.title = req.body.title || property.title;
    property.description = req.body.description || property.description;
    property.propertyType = req.body.propertyType || property.propertyType;
    property.location = req.body.location || property.location;
    property.amenities = req.body.amenities || property.amenities;
    property.bedrooms = req.body.bedrooms || property.bedrooms;
    property.bathrooms = req.body.bathrooms || property.bathrooms;
    property.maxGuests = req.body.maxGuests || property.maxGuests;
    property.pricePerNight = req.body.pricePerNight || property.pricePerNight;
    property.cleaningFee = req.body.cleaningFee || property.cleaningFee;
    property.images = req.body.images || property.images;
    property.availability = req.body.availability || property.availability;
    property.houseRules = req.body.houseRules || property.houseRules;
    property.cancellationPolicy = req.body.cancellationPolicy || property.cancellationPolicy;

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private
// @desc    Check property availability
// @route   GET /api/properties/:id/availability
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide both start and end dates');
  }

  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  const isAvailable = property.availability.some(period => {
    const periodStart = new Date(period.startDate);
    const periodEnd = new Date(period.endDate);
    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);
    
    return (
      !period.isBlocked &&
      requestedStart >= periodStart && 
      requestedEnd <= periodEnd
    );
  });

  res.json({
    isAvailable,
    message: isAvailable 
      ? 'Property is available for these dates'
      : 'Property is not available for these dates'
  });
});

const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    // Verify property owner
    if (property.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this property');
    }

    await property.remove();
    res.json({ message: 'Property removed' });
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

module.exports = {
  getProperties,
  getProperty,
  checkAvailability,
  createProperty,
  updateProperty,
  deleteProperty
};
