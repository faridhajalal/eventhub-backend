const Booking = require('../models/booking');
const Event = require('../models/Event');

const createBooking = async (req, res) => {
  try {
    // Accept both 'quantity' (frontend) and 'numberOfTickets' (legacy)
    const { eventId, quantity, numberOfTickets } = req.body;
    const tickets = quantity || numberOfTickets;
    const userId = req.user.id;

    if (!eventId || !tickets)
      return res.status(400).json({ success: false, message: 'eventId and quantity are required' });

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.availableSeats < tickets)
      return res.status(400).json({ success: false, message: 'Not enough seats available' });

    const totalAmount = event.price * tickets;

    const booking = new Booking({
      user: userId,
      event: eventId,
      numberOfTickets: tickets,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'unpaid'
    });
    await booking.save();

    await Event.findByIdAndUpdate(eventId, {
      $inc: { availableSeats: -tickets }
    });

    const populated = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('event', 'name date venue image price');

    res.status(201).json({ success: true, booking: populated });

  } catch (error) {
    console.error('Create booking error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'name date time venue image price category')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings, count: bookings.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'name date venue price')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings, count: bookings.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    booking.status = 'cancelled';
    await booking.save();

    await Event.findByIdAndUpdate(booking.event, {
      $inc: { availableSeats: booking.numberOfTickets }
    });

    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking };
