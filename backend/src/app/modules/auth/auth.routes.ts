// auth.routes.ts
import express from 'express';
import {
  verifyPhoneAndRegister,
  completeBasicInfo,
  getProfile,
  updateProfile,
  updateAddress,
  uploadProfileImage,
  uploadDocument,
  addPackageToWishlist,
  removePackageFromWishlist,
  getAllUsers,
} from './auth.controller';
import { authenticate } from '../../middlewares/firebaseAuth';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.post('/verify-phone', authenticate, verifyPhoneAndRegister);

router.post('/complete-profile', authenticate, completeBasicInfo);

router.get('/profile', authenticate, getProfile);

router.patch(
  '/profile',
  authenticate,
  upload.single('profileImage'),
  updateProfile,
);

// Update address
router.patch('/address', authenticate, updateAddress);

router.post(
  '/profile-image',
  authenticate,
  upload.single('profileImage'),
  uploadProfileImage,
);

router.post(
  '/upload-document',
  authenticate,
  upload.single('documentImage'),
  uploadDocument,
);

router.post('/wishlist', authenticate, addPackageToWishlist);
router.delete('/wishlist/:packageId', authenticate, removePackageFromWishlist);
router.get('/all-users', adminAuthMiddleware, getAllUsers);
export const authRouter = router;
