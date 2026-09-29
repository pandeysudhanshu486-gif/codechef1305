import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protectAdmin, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protectAdmin, updateEvent)
  .delete(protectAdmin, deleteEvent);

export default router;
