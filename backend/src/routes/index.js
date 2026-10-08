import express from "express";
import noteRoutes from './note.routes.js';
import boardRoutes from './board.routes.js';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import labelRoutes from './label.routes.js';

import protect from "../middleware/auth.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', protect, userRoutes);
router.use('/boards', protect, boardRoutes);
router.use('/notes', protect, noteRoutes);
router.use('/labels', protect, labelRoutes);

export default router;