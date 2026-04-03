import express from 'express';
import leadRoutes from './leadRoutes.js';

const router = express.Router();

router.use("/leads", leadRoutes);

export default router;