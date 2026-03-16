// routes/holidaySection.routes.ts
import express from 'express';
import {
  getHolidaySection,
  updateMainFields,
  addFeature,
  updateFeature,
  deleteFeature,
  updateHolidaySection,
} from './holidayControllers';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/holiday-section', getHolidaySection);

router.put(
  '/holiday-section/main-fields',
  adminAuthMiddleware,
  updateMainFields,
);

router.post('/holiday-section/feature', adminAuthMiddleware, addFeature);

router.put(
  '/holiday-section/feature/:featureId',
  adminAuthMiddleware,
  updateFeature,
);

router.delete(
  '/holiday-section/feature/:featureId',
  adminAuthMiddleware,
  deleteFeature,
);

router.put('/holiday-section', adminAuthMiddleware, updateHolidaySection);

export const travelDealsHeadingRouter = router;
