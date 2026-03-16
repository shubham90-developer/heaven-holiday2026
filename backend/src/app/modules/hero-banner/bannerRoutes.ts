import express from 'express';
import {
  getHeroBanner,
  updateHeroBanner,
  createHeroBanner,
  deleteHeroBanner,
} from './bannerController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
import { upload } from '../../config/cloudinary';
const router = express.Router();
router.post('/', adminAuthMiddleware, upload.single('image'), createHeroBanner);
router.get('/', getHeroBanner);
router.put('/', adminAuthMiddleware, upload.single('image'), updateHeroBanner);
router.delete('/', adminAuthMiddleware, deleteHeroBanner);

export const heroBannerRouter = router;
