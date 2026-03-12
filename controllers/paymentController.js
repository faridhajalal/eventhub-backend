const Payment = require('../models/payment');
const Booking = require('../models/booking');

const createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!bookingId || !paymentMethod)
      return res.status(400).json({ success: false, message: 'bookingId and paymentMethod are required' });

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.user.toString() !== userId)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    if (booking.paymentStatus === 'paid')
      return res.status(400).json({ success: false, message: 'Already paid' });

    // Generate fake transaction ID
    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      user: userId,
      amount: booking.totalAmount,
      paymentMethod,
      status: 'success',
      transactionId
    });
    await payment.save();

    // Update booking payment status
    booking.paymentStatus = 'paid';
    booking.paymentMethod = paymentMethod;
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Payment successful!',
      payment,
      transactionId
    });

  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate({ path: 'booking', populate: { path: 'event', select: 'name' } })
      .sort({ createdAt: -1 });

    const totalRevenue = payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({ success: true, payments, totalRevenue, count: payments.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPayment, getAllPayments };