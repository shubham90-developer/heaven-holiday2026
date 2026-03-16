// routes/excitedtowork.routes.ts
import express from 'express';
import {
  getExcitedToWork,
  updateExcitedToWork,
} from './excitedToWorkControllers';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// GET /api/excitedtowork - Get excited to work content
router.get('/', getExcitedToWork);

// PUT /api/excitedtowork - Update excited to work content
router.put('/', adminAuthMiddleware, updateExcitedToWork);

export const excitedToWorkRouter = router;
