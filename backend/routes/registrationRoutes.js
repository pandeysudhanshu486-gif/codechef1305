import express from 'express';
import {
  createRegistration,
  getAllRegistrations,
  getRegistrationsByEvent
} from '../controllers/registrationController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createRegistration)
  .get(protectAdmin, getAllRegistrations);

router.route('/event/:eventId')
  .get(protectAdmin, getRegistrationsByEvent);

export default router;
