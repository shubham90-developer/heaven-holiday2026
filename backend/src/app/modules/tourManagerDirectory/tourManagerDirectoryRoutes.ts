import express from 'express';
import {
  getTourManagerDirectory,
  updateDirectoryHeading,
  addManager,
  updateManager,
  deleteManager,
} from './tourManagerDirectoryController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
import { upload } from '../../config/cloudinary';

const router = express.Router();

// Get directory with all managers (supports ?search= and ?letter= query params)
router.get('/', getTourManagerDirectory);

// Update directory heading
router.put('/heading', adminAuthMiddleware, updateDirectoryHeading);

// Add a manager
router.post(
  '/manager',
  adminAuthMiddleware,
  upload.single('image'),
  addManager,
);

// Update a manager
router.put(
  '/manager/:managerId',
  adminAuthMiddleware,
  upload.single('image'),
  updateManager,
);

// Delete a manager
router.delete('/manager/:managerId', adminAuthMiddleware, deleteManager);

export const tourManagerTeamRouter = router;
