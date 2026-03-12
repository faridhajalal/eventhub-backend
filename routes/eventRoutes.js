const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory
} = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getAllEvents);
router.get('/category/:category', getEventsByCategory);
router.get('/:id', getEventById);
router.post('/', authMiddleware, roleMiddleware('admin'), createEvent);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateEvent);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteEvent);

module.exports = router;