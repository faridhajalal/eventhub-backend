const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes       = require('./routes/authRoutes');
const eventRoutes      = require('./routes/eventRoutes');
const bookingRoutes    = require('./routes/bookingRoutes');
const paymentRoutes    = require('./routes/paymentRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const ratingRoutes     = require('./routes/ratingRoutes');
const feedbackRoutes   = require('./routes/feedbackRoutes'); // IMPORTANT

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/feedback', feedbackRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'EventHub API Running ✅' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log('✅ MongoDB Connected');

  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });

})
.catch(err => console.log('❌ MongoDB Error:', err));