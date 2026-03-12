const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  expectedDate: String,
  expectedVenue: String,
  expectedAudience: String,
  contactEmail: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
}, { timestamps: true });

module.exports = mongoose.model('Suggestion', suggestionSchema);
