import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required']
    },
    ticketId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    college: {
      type: String,
      required: [true, 'College / University name is required'],
      trim: true
    },
    year: {
      type: String,
      required: [true, 'Academic year is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG/Other']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Enforce unique registration per email per event
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
