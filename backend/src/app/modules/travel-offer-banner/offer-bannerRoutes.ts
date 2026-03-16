// routes/celebrate.routes.ts
import express from 'express';
import {
  getCelebrate,
  updateMainFields,
  addSlide,
  updateSlide,
  deleteSlide,
} from './offer-bannerController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
import { upload } from '../../config/cloudinary';

const router = express.Router();

router.get('/celebrate', getCelebrate);

router.put('/celebrate/main-fields', adminAuthMiddleware, updateMainFields);

router.post(
  '/celebrate/slide',
  adminAuthMiddleware,
  upload.single('image'),
  addSlide,
);

router.put(
  '/celebrate/slide/:slideId',
  adminAuthMiddleware,
  upload.single('image'),
  updateSlide,
);

router.delete('/celebrate/slide/:slideId', adminAuthMiddleware, deleteSlide);

export const celebrateRouter = router;
