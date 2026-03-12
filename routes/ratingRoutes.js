// ========== models/Rating.js ==========
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: String,
}, { timestamps: true });

// One rating per user per event
ratingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);


// ========== routes/ratingRoutes.js ==========
const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const { verifyToken } = require('../middleware/authMiddleware');

// Get ratings for an event
router.get('/:eventId', async (req, res) => {
  try {
    const ratings = await Rating.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit rating
router.post('/:eventId', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { rating, review } = req.body;

    // Check if already rated
    const existing = await Rating.findOne({ eventId: req.params.eventId, userId });
    if (existing) return res.status(400).json({ message: 'You have already rated this event!' });

    const newRating = new Rating({
      eventId: req.params.eventId,
      userId,
      userName: req.user.name || 'User',
      rating,
      review,
    });
    await newRating.save();
    res.status(201).json({ message: 'Rating submitted!', rating: newRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
