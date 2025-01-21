import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/userProfileController.js';
const router = express.Router();

router.get('/:role', authenticate, getUserProfile);

export default router;
