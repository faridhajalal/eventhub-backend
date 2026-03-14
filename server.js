const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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
const feedbackRoutes   = require('./routes/feedbackRoutes');

app.use('/api/auth',        authRoutes);
app.use('/api/events',      eventRoutes);
app.use('/api/bookings',    bookingRoutes);
app.use('/api/payments',    paymentRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/ratings',     ratingRoutes);
app.use('/api/feedback',    feedbackRoutes);

app.get('/', (req, res) => res.json({ message: 'EventHub API Running ✅' }));

const MONGO_URI = 'mongodb+srv://faridhajalal2003_db_user:mern12345@cluster0.lkttodk.mongodb.net/eventDB?retryWrites=true&w=majority';
const PORT = 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.log('❌ MongoDB Error:', err));
