import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'clubsphere_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    const admin = await Admin.findOne({ username: username.trim() });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials'
      });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify current admin session
// @route   GET /api/auth/verify
// @access  Private/Admin
export const verifyAuth = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        username: req.admin.username,
        role: req.admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate statistics for Admin Dashboard
// @route   GET /api/auth/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const totalRegistrations = await Registration.countDocuments();

    // Group events by category
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Recent registrations with event info
    const recentRegistrations = await Registration.find()
      .populate('eventId', 'title category date')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        categoryStats,
        recentRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
};
