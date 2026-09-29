import express from 'express';
import {
  loginAdmin,
  verifyAuth,
  getAdminStats
} from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/verify', protectAdmin, verifyAuth);
router.get('/stats', protectAdmin, getAdminStats);

export default router;
