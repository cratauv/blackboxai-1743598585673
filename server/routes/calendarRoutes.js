const express = require('express');
const router = express.Router();
const { getPropertyCalendar } = require('../controllers/calendarController');

router.get('/:propertyId', getPropertyCalendar);

module.exports = router;