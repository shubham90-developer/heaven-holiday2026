import express from 'express';

import {
  getOfferBanner,
  updateOfferBanner,
  createOfferBanner,
  deleteOfferBanner,
} from './offer-banner.controller';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
import { upload } from '../../config/cloudinary';
const router = express.Router();
router.post(
  '/',
  adminAuthMiddleware,
  upload.single('image'),
  createOfferBanner,
);
router.get('/', getOfferBanner);
router.put('/', adminAuthMiddleware, upload.single('image'), updateOfferBanner);
router.delete('/', adminAuthMiddleware, deleteOfferBanner);

export const offerBannerRouter = router;
