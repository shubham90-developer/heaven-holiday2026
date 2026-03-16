// routes/howWeHire.routes.ts
import { Router } from 'express';
import {
  getHowWeHire,
  updateHowWeHireInfo,
  addHowWeHireStep,
  updateHowWeHireStep,
  deleteHowWeHireStep,
} from './hireControllers';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getHowWeHire);

router.put('/info', adminAuthMiddleware, updateHowWeHireInfo);

router.post(
  '/step',
  adminAuthMiddleware,
  upload.single('img'),
  addHowWeHireStep,
);

router.put(
  '/step',
  adminAuthMiddleware,
  upload.single('img'),
  updateHowWeHireStep,
);

router.delete('/step', adminAuthMiddleware, deleteHowWeHireStep);

export const howWeHireRouter = router;
