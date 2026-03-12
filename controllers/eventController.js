const Event = require('../models/Event');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: { $ne: 'cancelled' } }).sort({ date: 1 });
    res.json({ success: true, events, count: events.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined')
      return res.status(400).json({ success: false, message: 'Invalid event ID' });
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    console.log('📥 Body received:', JSON.stringify(req.body, null, 2));
    console.log('👤 User:', JSON.stringify(req.user, null, 2));

    const { name, description, date, time, venue, category, totalSeats, availableSeats, price, image } = req.body;

    if (!name)        return res.status(400).json({ success: false, message: 'Event name is required' });
    if (!description) return res.status(400).json({ success: false, message: 'Description is required' });
    if (!date)        return res.status(400).json({ success: false, message: 'Date is required' });
    if (!time)        return res.status(400).json({ success: false, message: 'Time is required' });
    if (!venue)       return res.status(400).json({ success: false, message: 'Venue is required' });
    if (!category)    return res.status(400).json({ success: false, message: 'Category is required' });
    if (!totalSeats)  return res.status(400).json({ success: false, message: 'Total seats is required' });
    if (price === undefined || price === null || price === '') return res.status(400).json({ success: false, message: 'Price is required' });

    const total     = parseInt(totalSeats);
    const available = (availableSeats !== undefined && availableSeats !== '') ? parseInt(availableSeats) : total;

    if (isNaN(total) || isNaN(available))
      return res.status(400).json({ success: false, message: 'Seats must be valid numbers' });
    if (available > total)
      return res.status(400).json({ success: false, message: 'Available seats cannot exceed total seats' });

    const userId = req.user?.userId || req.user?.id || null;

    const eventData = {
      name:           name.trim(),
      description:    description.trim(),
      date:           new Date(date),
      time,
      venue:          venue.trim(),
      category,
      totalSeats:     total,
      availableSeats: available,
      price:          parseFloat(price),
      image:          image ? image.trim() : '',
      status:         'upcoming',
    };
    if (userId) eventData.createdBy = userId;

    const event = new Event(eventData);
    await event.save();

    console.log('✅ Event created:', event.name, event._id);
    res.status(201).json({ success: true, event, message: 'Event created successfully!' });

  } catch (error) {
    console.error('❌ createEvent error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined')
      return res.status(400).json({ success: false, message: 'Invalid event ID' });

    if (req.body.date) req.body.date = new Date(req.body.date);

    if (req.body.availableSeats !== undefined && req.body.totalSeats !== undefined) {
      if (parseInt(req.body.availableSeats) > parseInt(req.body.totalSeats))
        return res.status(400).json({ success: false, message: 'Available seats cannot exceed total seats' });
    }

    const event = await Event.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    res.json({ success: true, event, message: 'Event updated successfully!' });
  } catch (error) {
    console.error('updateEvent error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined')
      return res.status(400).json({ success: false, message: 'Invalid event ID' });
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const events = await Event.find({ category, status: { $ne: 'cancelled' } }).sort({ date: 1 });
    res.json({ success: true, events, count: events.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventsByCategory };
