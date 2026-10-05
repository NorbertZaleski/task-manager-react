import express from "express";
import noteRoutes from './note.routes.js';
import boardRoutes from './board.routes.js';

const router = express.Router();

//router.use('/auth', );
//router.use('/user', );
router.use('/boards', boardRoutes);
router.use('/notes', noteRoutes);

export default router;