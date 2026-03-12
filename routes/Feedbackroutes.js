const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all feedback (admin)
router.get('/', async (req, res) => {
  try {

    const feedbacks = await Feedback
      .find()
      .sort({ createdAt: -1 });

    res.json(feedbacks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;