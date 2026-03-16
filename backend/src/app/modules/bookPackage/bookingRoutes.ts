// routes/bookingRoutes.ts

import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  addPayment,
  cancelBooking,
  getBookingSummary,
  updateBookingTravelers,
  getAllBookings,
  deleteBooking,
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getAllPendingRefunds,
  updateRefundStatus,
  uploadBookingDocument,
} from './bookingController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
import { authenticate } from '../../middlewares/firebaseAuth';
import { upload } from '../../config/cloudinary';
const router = express.Router();

// ========== ADMIN ROUTES (MUST BE FIRST) ==========
router.get('/admin/all', adminAuthMiddleware, getAllBookings);
router.get('/admin/refunds/pending', adminAuthMiddleware, getAllPendingRefunds);
router.patch(
  '/admin/refunds/:bookingId/:refundId/status',
  adminAuthMiddleware,
  updateRefundStatus,
);
router.delete('/admin/:bookingId', adminAuthMiddleware, deleteBooking);

// ========== USER ROUTES ==========
router.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'passportImage_0', maxCount: 1 },
    { name: 'passportImage_1', maxCount: 1 },
    { name: 'passportImage_2', maxCount: 1 },
    { name: 'passportImage_3', maxCount: 1 },
    { name: 'passportImage_4', maxCount: 1 },
    { name: 'passportImage_5', maxCount: 1 },
    { name: 'passportImage_6', maxCount: 1 },
    { name: 'passportImage_7', maxCount: 1 },
    { name: 'passportImage_8', maxCount: 1 },
    { name: 'passportImage_9', maxCount: 1 },
    { name: 'passportImage_10', maxCount: 1 },
    { name: 'passportImage_11', maxCount: 1 },
    { name: 'passportImage_12', maxCount: 1 },
    { name: 'passportImage_13', maxCount: 1 },
    { name: 'passportImage_14', maxCount: 1 },
    { name: 'passportImage_15', maxCount: 1 },
    { name: 'passportImage_16', maxCount: 1 },
    { name: 'passportImage_17', maxCount: 1 },
    { name: 'passportImage_18', maxCount: 1 },
    { name: 'passportImage_19', maxCount: 1 },
  ]),
  createBooking,
);
router.get('/', authenticate, getUserBookings);
router.get('/:bookingId', authenticate, getBookingById);
router.get('/:bookingId/summary', authenticate, getBookingSummary);

router.post(
  '/:bookingId/create-payment-order',
  authenticate,
  createPaymentOrder,
);
router.post('/:bookingId/verify-payment', authenticate, verifyPayment);
router.post('/:bookingId/payment-failure', authenticate, handlePaymentFailure);
router.post('/:bookingId/payment', authenticate, addPayment);

router.patch(
  '/:bookingId/travelers',
  authenticate,
  upload.fields([
    { name: 'passportImage_0', maxCount: 1 },
    { name: 'passportImage_1', maxCount: 1 },
    { name: 'passportImage_2', maxCount: 1 },
    { name: 'passportImage_3', maxCount: 1 },
    { name: 'passportImage_4', maxCount: 1 },
    { name: 'passportImage_5', maxCount: 1 },
    { name: 'passportImage_6', maxCount: 1 },
    { name: 'passportImage_7', maxCount: 1 },
    { name: 'passportImage_8', maxCount: 1 },
    { name: 'passportImage_9', maxCount: 1 },
  ]),
  updateBookingTravelers,
);

router.patch(
  '/admin/documents/upload',
  adminAuthMiddleware,
  upload.single('file'),
  uploadBookingDocument,
);
router.patch('/:bookingId/cancel', authenticate, cancelBooking);

export const bookingRouter = router;
