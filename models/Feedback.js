const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  details: { type: String },
  name: { type: String, default: 'Anonymous' },
  email: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports =
  mongoose.models.Feedback ||
  mongoose.model('Feedback', feedbackSchema);