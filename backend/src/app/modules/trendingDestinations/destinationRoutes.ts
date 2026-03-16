import { Router } from 'express';
import {
  updateTitle,
  getTrendingDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from './destinationsController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
import { upload } from '../../config/cloudinary';

const router = Router();

router.put('/title', adminAuthMiddleware, updateTitle);

router.get('/', getTrendingDestinations);

router.post(
  '/destinations',
  adminAuthMiddleware,
  upload.single('image'),
  createDestination,
);

router.put(
  '/destinations/:id',
  adminAuthMiddleware,
  upload.single('image'),
  updateDestination,
);

router.delete('/destinations/:id', adminAuthMiddleware, deleteDestination);

export const trendingDestinationsRouter = router;
