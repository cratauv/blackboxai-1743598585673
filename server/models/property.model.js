const mongoose = require('mongoose');

// Add text index for search
propertySchema.index({ 
  name: 'text',
  description: 'text',
  address: 'text'
});

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'cabin', 'hotel', 'other'],
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [String],
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  maxGuests: {
    type: Number,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  cleaningFee: Number,
  images: [{
    url: String,
    caption: String
  }],
  availability: [{
    startDate: Date,
    endDate: Date,
    isBlocked: { type: Boolean, default: false }
  }],
  bookingDetails: {
    checkInTime: { type: String, default: '15:00' },
    checkOutTime: { type: String, default: '11:00' },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate'
    },
    houseRules: [{
      rule: String,
      description: String
    }],
    minimumStay: { type: Number, default: 1 },
    maxConsecutiveNights: Number,
    advanceNotice: { type: Number, default: 24 } // hours
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for search optimization
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'location.country': 1 });
propertySchema.index({ pricePerNight: 1 });
propertySchema.index({ propertyType: 1 });

module.exports = mongoose.model('Property', propertySchema);