const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  handleWebhook  
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);
router.get('/history', protect, getPaymentHistory);
router.post('/refund', protect, authorize('admin'), createRefund);

module.exports = router;