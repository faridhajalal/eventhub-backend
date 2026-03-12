const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, cancelBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/my', authMiddleware, getMyBookings);
router.get('/all/bookings', authMiddleware, roleMiddleware('admin'), getAllBookings);
router.put('/:id/cancel', authMiddleware, cancelBooking);

module.exports = router;