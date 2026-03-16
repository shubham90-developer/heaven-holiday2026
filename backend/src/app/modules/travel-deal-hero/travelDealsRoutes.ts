// routes/travelDealBanner.routes.ts
import express from 'express';

import {
  getTravelDealBanner,
  updateTravelDealBanner,
} from './travelDealControllers';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/travel-deal-banner', getTravelDealBanner);

router.put(
  '/travel-deal-banner',
  adminAuthMiddleware,

  upload.single('image'),
  updateTravelDealBanner,
);

export const travelDealBannerRouter = router;
