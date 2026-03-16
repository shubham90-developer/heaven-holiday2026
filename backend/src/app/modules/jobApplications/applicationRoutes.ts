import { Router } from 'express';
import {
  createJobApplication,
  getAllJobApplications,
  updateApplicationStatus,
  deleteJobApplication,
} from './applicationControllers';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.post('/', upload.single('resume'), createJobApplication);

router.get('/', adminAuthMiddleware, getAllJobApplications);

router.patch('/:id/status', adminAuthMiddleware, updateApplicationStatus);

router.delete('/:id', adminAuthMiddleware, deleteJobApplication);

export const JobApplicationRouter = router;
