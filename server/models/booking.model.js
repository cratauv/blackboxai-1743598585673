const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  checkInDate: { 
    type: Date, 
    required: true 
  },
  checkOutDate: { 
    type: Date, 
    required: true 
  },
  guests: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 }
  },
  pricing: {
    nightlyRate: { type: Number, required: true },
    cleaningFee: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    taxes: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: String,
  transactionId: String,
  specialRequests: String,
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate'
  },
  cancellationReason: String,
  cancellationDate: Date,
  refundAmount: Number,
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: Date
  }
}, { timestamps: true });

// Add indexes for frequently queried fields
bookingSchema.index({ user: 1 });
bookingSchema.index({ property: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);