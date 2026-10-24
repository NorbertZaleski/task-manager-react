import express from 'express';
import rateLimiter from "../middleware/rateLimiter.js";
import { getMe, login, register } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);

export default router;
