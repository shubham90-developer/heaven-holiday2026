import express from 'express';
import { upload } from '../../config/cloudinary';
import {
  getAllMain,
  createMain,
  updateMainFields,
  updateMainItem,
  updateMainItemsArray,
  deleteMain,
} from './servicesController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// Get all main data
router.get('/', getAllMain);

// Create new main
router.post('/', adminAuthMiddleware, upload.single('icon'), createMain);

// Update only main fields (title, subtitle) - does NOT touch items
router.patch(
  '/:id/fields',
  adminAuthMiddleware,
  upload.none(),
  updateMainFields,
);

// Update a specific item in the items array
router.patch(
  '/:id/items/:itemIndex',
  adminAuthMiddleware,
  upload.single('icon'),
  updateMainItem,
);

// Update entire items array
router.patch(
  '/:id/items',
  adminAuthMiddleware,
  upload.single('icon'),
  updateMainItemsArray,
);

// Delete main
router.delete('/:id', adminAuthMiddleware, deleteMain);

export const servicesRouter = router;
