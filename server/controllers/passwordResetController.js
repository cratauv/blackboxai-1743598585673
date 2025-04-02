const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const generateResetToken = require('../utils/passwordResetToken');
const sendEmail = require('../utils/email');

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  // Generate and save reset token
  const { resetToken, hashedToken, tokenExpiry } = generateResetToken();
  user.resetToken = hashedToken;
  user.resetTokenExpiry = tokenExpiry;
  await user.save();

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;

  // Send email
  const message = `You are receiving this email because you requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetToken,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid token or token has expired');
  }

  // Set new password
  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ success: true, data: 'Password updated successfully' });
});

module.exports = { forgotPassword, resetPassword };