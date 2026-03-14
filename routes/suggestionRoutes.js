const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/suggestions — Submit suggestion (logged in user)
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const suggestion = new Suggestion({ ...req.body, userId });
    await suggestion.save();
    res.status(201).json({ message: 'Suggestion submitted!', suggestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/suggestions — Get all suggestions (admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/suggestions/:id — Update status (admin)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;