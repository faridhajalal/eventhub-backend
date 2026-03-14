const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      // Frontend categories
      'Music', 'Sports', 'Food', 'Art', 'Technology',
      'Fashion', 'Education', 'Comedy', 'Dance',
      // Admin/legacy categories
      'Concert', 'Conference', 'Workshop', 'Exhibition',
      'Festival', 'Theatre', 'Other'
    ]
  },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
