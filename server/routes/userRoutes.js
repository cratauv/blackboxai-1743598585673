const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getAllUsers,
  updateUser, 
  deleteUser
} = require('../controllers/userController');
const {
  forgotPassword,
  resetPassword
} = require('../controllers/passwordResetController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.route('/me')
  .get(protect, getMe);
  
router.route('/:id')
  .put(protect, authorize('admin'), updateUser)
  .patch(protect, authorize('admin'), updateUserRole)
  .delete(protect, authorize('admin'), deleteUser);

// Admin-only routes
router.route('/')
  .get(protect, authorize('admin'), getAllUsers);

module.exports = router;
