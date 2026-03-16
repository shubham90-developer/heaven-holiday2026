import { Router } from 'express';
import {
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from './applProcessController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getAllApplications);
router.post(
  '/',
  adminAuthMiddleware,
  upload.single('image'),
  createApplication,
);
router.put(
  '/:id',
  adminAuthMiddleware,
  upload.single('image'),
  updateApplication,
);
router.delete('/:id', adminAuthMiddleware, deleteApplication);

export const applnProcessRouter = router;
