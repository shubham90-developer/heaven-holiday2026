import express from 'express';
import {
  getTourManagers,
  createTourManager,
  updateTourManager,
} from './tourManagerController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/', getTourManagers);

router.post('/', adminAuthMiddleware, createTourManager);

router.put('/:id', adminAuthMiddleware, updateTourManager);

export const tourManagerRouter = router;
