const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, createPayment);
router.get('/all/payments', authMiddleware, roleMiddleware('admin'), getAllPayments);

module.exports = router;