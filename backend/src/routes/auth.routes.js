import express from 'express';
import rateLimiter from "../middleware/rateLimiter.js";
import protect from "../middleware/auth.js";
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;
