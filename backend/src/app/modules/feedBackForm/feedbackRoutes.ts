// feedback.route.ts
import express from 'express';
import { upload } from '../../config/cloudinary';
import { createFeedback, getAllFeedback } from './feedbackController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.post('/', createFeedback);

router.get('/', getAllFeedback);

export const FeedbackRouter = router;
