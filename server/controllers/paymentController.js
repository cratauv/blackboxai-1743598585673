const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authorize } = require('../middleware/authMiddleware');
const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd', metadata = {} } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata
    });

    // Create payment record
    await Payment.create({
      user: req.user._id,
      booking: metadata.bookingId,
      amount: amount,
      currency,
      stripePaymentId: paymentIntent.id,
      status: 'pending',
      paymentMethod: paymentIntent.payment_method_types[0],
      metadata
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(400);
    throw new Error('Payment processing failed');
  }
});

// @desc    Handle payment webhook
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle payment events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { stripePaymentId: paymentIntent.id },
        { 
          status: 'succeeded',
          receiptUrl: paymentIntent.charges.data[0].receipt_url,
          paymentMethod: paymentIntent.payment_method_types[0]
        }
      );
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Handle failed payment
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Get payment history
// @route   GET /api/payment/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('booking', 'property checkInDate checkOutDate status')
    .lean();

  // Format response
  const formattedPayments = payments.map(payment => ({
    id: payment._id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    date: payment.createdAt,
    receiptUrl: payment.receiptUrl,
    booking: payment.booking,
    paymentMethod: payment.paymentMethod
  }));

  res.json(formattedPayments);
});

// @desc    Create refund
// @route   POST /api/payment/refund
// @access  Private/Admin
const createRefund = asyncHandler(async (req, res) => {
  const { paymentId, amount, reason } = req.body;

  // Validate refund amount
  if (amount <= 0) {
    res.status(400);
    throw new Error('Refund amount must be positive');
  }

  try {
    // Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: reason || 'requested_by_customer'
    });

    // Update payment record
    const updatedPayment = await Payment.findOneAndUpdate(
      { stripePaymentId: paymentId },
      { 
        status: 'refunded',
        $push: { 
          refunds: {
            amount,
            reason,
            stripeRefundId: refund.id,
            status: refund.status
          }
        }
      },
      { new: true }
    );

    res.json({
      id: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
      payment: updatedPayment
    });
  } catch (err) {
    console.error('Refund error:', err);
    res.status(400);
    throw new Error('Refund processing failed');
  }
});

module.exports = {
  createPaymentIntent,
  handleWebhook,
  getPaymentHistory,
  createRefund
};
