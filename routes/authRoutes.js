const express = require('express');
const router = express.Router();
const { signup, login, getProfile, makeAdmin } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.get('/make-admin/:email', makeAdmin);

module.exports = router;