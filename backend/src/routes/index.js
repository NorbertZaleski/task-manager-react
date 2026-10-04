import express from "express";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/board', boardRoutes);
router.use('note', noteRoutes);

export default router;