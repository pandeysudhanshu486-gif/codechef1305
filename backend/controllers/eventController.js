import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get all events with optional filters (search, category, sort)
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    // Search query filter
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { venue: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Sorting
    let sortOptions = { date: 1 };
    if (sort === 'date-desc') sortOptions = { date: -1 };
    if (sort === 'title-asc') sortOptions = { title: 1 };
    if (sort === 'title-desc') sortOptions = { title: -1 };

    const events = await Event.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Also get the live count of registrations for accuracy
    const regCount = await Registration.countDocuments({ eventId: event._id });
    const eventData = event.toObject();
    eventData.registeredCount = regCount;

    res.status(200).json({
      success: true,
      data: eventData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      image,
      capacity,
      isFeatured,
      status
    } = req.body;

    if (!title || !description || !date || !time || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, date, time, venue'
      });
    }

    const event = await Event.create({
      title,
      description,
      category: category || 'Technical',
      date,
      time,
      venue,
      image: image || '',
      capacity: capacity ? Number(capacity) : 100,
      isFeatured: Boolean(isFeatured),
      status: status || 'Upcoming'
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete associated registrations as well
    await Registration.deleteMany({ eventId: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
