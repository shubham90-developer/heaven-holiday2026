import express from 'express';
import {
  getGallery,
  updateGalleryInfo,
  addImageToGallery,
  deleteImageFromGallery,
  updateImageStatus,
} from './galleryController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/', getGallery);
router.put('/info', adminAuthMiddleware, updateGalleryInfo);
router.post(
  '/image',
  adminAuthMiddleware,
  upload.single('image'),
  addImageToGallery,
);
router.delete('/image', adminAuthMiddleware, deleteImageFromGallery);
router.put('/image/status', adminAuthMiddleware, updateImageStatus);

export const galleryRouter = router;
