import express from 'express';
import { getCounter, updateCounter } from './counter.controller';
const router = express.Router();
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
router.get('/', getCounter);
router.put('/', adminAuthMiddleware, updateCounter);

export const counterRouter = router;
