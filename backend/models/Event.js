import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: {
        values: ['Technical', 'Cultural', 'Workshop', 'Sports', 'Hackathon', 'Competition', 'Management', 'Other'],
        message: '{VALUE} is not a valid category'
      },
      default: 'Technical'
    },
    date: {
      type: String,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    capacity: {
      type: Number,
      default: 100,
      min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming'
    }
  },
  {
    timestamps: true
  }
);

// Virtual to populate registrations
eventSchema.virtual('registrations', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'eventId'
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
