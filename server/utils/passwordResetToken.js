const crypto = require('crypto');

const generateResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  return { resetToken, hashedToken, tokenExpiry };
};

module.exports = generateResetToken;