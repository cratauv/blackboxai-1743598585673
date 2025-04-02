const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'zh'] // Supported languages
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const bookingOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD'] // Supported currencies
  },
  type: {
    type: String,
    enum: ['service', 'upgrade', 'addon'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bookingOptionSchema.methods.updateAverageRating = async function() {
  const result = await this.model('BookingOption').aggregate([
    { $match: { _id: this._id } },
    { $unwind: '$reviews' },
    { 
      $group: {
        _id: '$_id',
        averageRating: { $avg: '$reviews.rating' }
      }
    }
  ]);
  
  this.averageRating = result[0]?.averageRating || 0;
  await this.save();
};

module.exports = mongoose.model('BookingOption', bookingOptionSchema);