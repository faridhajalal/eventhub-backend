const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: String,
}, { timestamps: true });

ratingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);

module.exports = Rating;