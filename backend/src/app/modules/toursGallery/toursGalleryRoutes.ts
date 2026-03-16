// routes/toursGalleryRoutes.ts
import { Router } from 'express';
import {
  getGallery,
  createGallery,
  updateGallery,
  getImages,
  uploadImage,
  addImage,
  updateImage,
  updateImageWithUpload,
  deleteImage,
} from './toursGalleryControllers';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

// Gallery routes
router.get('/gallery', getGallery);
router.post('/gallery', adminAuthMiddleware, createGallery);
router.patch('/gallery', adminAuthMiddleware, updateGallery);

// Image routes
router.get('/gallery/images', getImages);

// Upload image to Cloudinary (NEW - with file upload)
router.post(
  '/gallery/images/upload',
  adminAuthMiddleware,
  upload.single('image'),
  uploadImage,
);

// Add image with URL (without file upload)
router.post('/gallery/images', adminAuthMiddleware, addImage);

// Update image with file upload (NEW - replace image file)
router.patch(
  '/gallery/images/:imageId/upload',
  adminAuthMiddleware,
  upload.single('image'),
  updateImageWithUpload,
);

// Update image without file upload (metadata only)
router.patch('/gallery/images/:imageId', adminAuthMiddleware, updateImage);

// Delete image (auto-deletes from Cloudinary)
router.delete('/gallery/images/:imageId', adminAuthMiddleware, deleteImage);

export const toursGalleryRouter = router;
