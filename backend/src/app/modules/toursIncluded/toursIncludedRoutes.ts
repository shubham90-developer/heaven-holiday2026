// routes/includes.routes.ts
import express from 'express';
import {
  getAllIncludes,
  createInclude,
  updateInclude,
  deleteInclude,
} from './toursIncludedController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
import { upload } from '../../config/cloudinary';

const router = express.Router();

// GET all includes
router.get('/', getAllIncludes);

// CREATE new include (with image upload)
router.post('/', adminAuthMiddleware, upload.single('image'), createInclude);

// UPDATE include by ID (with optional image upload)
router.put('/:id', adminAuthMiddleware, upload.single('image'), updateInclude);

// DELETE include by ID
router.delete('/:id', adminAuthMiddleware, deleteInclude);

export const IncludedRouter = router;
