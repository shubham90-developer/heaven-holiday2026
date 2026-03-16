import express from 'express';
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBannerById,
  deleteBannerById,
} from './banner.controller';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

router.get('/:id', getBannerById);

router.post('/', adminAuthMiddleware, upload.single('image'), createBanner);

router.put(
  '/:id',
  adminAuthMiddleware,
  upload.single('image'),
  updateBannerById,
);

router.delete('/:id', adminAuthMiddleware, deleteBannerById);

export const bannerRouter = router;
