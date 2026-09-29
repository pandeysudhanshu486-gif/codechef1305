import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// @desc    Register a student for an event
// @route   POST /api/registrations
// @access  Public
export const createRegistration = async (req, res, next) => {
  try {
    const { eventId, name, email, college, year, phone } = req.body;

    if (!eventId || !name || !email || !college || !year || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All registration fields are required (name, email, college, year, phone, eventId)'
      });
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or has expired'
      });
    }

    // Check duplicate registration
    const existingRegistration = await Registration.findOne({
      eventId,
      email: email.toLowerCase().trim()
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event with this email address'
      });
    }

    // Check capacity
    const currentRegCount = await Registration.countDocuments({ eventId });
    if (currentRegCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Registration is full. No more seats are available for this event.'
      });
    }

    // Generate unique Ticket ID
    const ticketId = `CS-${Math.floor(100000 + Math.random() * 900000)}`;

    const registration = await Registration.create({
      eventId,
      ticketId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      college: college.trim(),
      year,
      phone: phone.trim()
    });

    // Update event registered count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registeredCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your pass is confirmed.',
      data: {
        registration,
        event: {
          title: event.title,
          date: event.date,
          time: event.time,
          venue: event.venue,
          category: event.category
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations (with optional search and event filter)
// @route   GET /api/registrations
// @access  Private/Admin
export const getAllRegistrations = async (req, res, next) => {
  try {
    const { eventId, search } = req.query;
    let query = {};

    if (eventId && eventId !== 'all') {
      query.eventId = eventId;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { college: regex },
        { phone: regex },
        { ticketId: regex }
      ];
    }

    const registrations = await Registration.find(query)
      .populate('eventId', 'title date venue category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registrations for a specific event
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin
export const getRegistrationsByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ eventId })
      .populate('eventId', 'title date venue')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};
