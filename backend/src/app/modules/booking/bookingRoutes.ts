import express from 'express';
import {
  getOnlineBooking,
  updateOnlineBooking,
  createStep,
  updateStep,
  deleteStep,
} from './bookingController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// Public route - Get online booking content
router.get('/', getOnlineBooking);

// Admin routes - Protected
router.put('/', adminAuthMiddleware, updateOnlineBooking);

router.post('/steps', adminAuthMiddleware, upload.single('image'), createStep);

router.put(
  '/steps/:stepNo',
  adminAuthMiddleware,
  upload.single('image'),
  updateStep,
);

router.delete('/steps/:stepNo', adminAuthMiddleware, deleteStep);

export const onlineBookingRouter = router;
