const express = require('express');
const router = express.Router();
const {
  getBookingOptions,
  createBookingOption,
  updateBookingOption,
  deleteBookingOption,
  addReview,
  getReviews,
  getPendingReviews,
  moderateReview,
  searchReviews
} = require('../controllers/bookingOptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('admin'), getBookingOptions)
  .post(protect, authorize('admin'), createBookingOption);

router.route('/:id')
  .put(protect, authorize('admin'), updateBookingOption)
  .delete(protect, authorize('admin'), deleteBookingOption);

router.route('/:id/reviews')
  .get(getReviews)
  .post(protect, addReview);

router.route('/reviews/pending')
  .get(protect, authorize('admin'), getPendingReviews);

router.route('/reviews/search')
  .get(searchReviews);

router.route('/:optionId/reviews/:reviewId/moderate')
  .put(protect, authorize('admin'), moderateReview);

module.exports = router;