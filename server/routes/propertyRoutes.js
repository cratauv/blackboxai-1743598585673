const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProperties) // Supports queries: ?search=term&sort=price&limit=10&page=2
  .post(protect, createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

router.route('/:id/availability')
  .get(checkAvailability);

module.exports = router;