// routes/contentRoutes.ts
import express from 'express';
import { getContent, updateContent } from './messageController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/', getContent);

router.put('/', adminAuthMiddleware, updateContent);

export const joinUsRouter = router;
