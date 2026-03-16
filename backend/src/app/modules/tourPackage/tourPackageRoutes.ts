import { Router } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createTourPackageCard,
  getTourPackageCards,
  updateTourPackageCard,
  deleteTourPackageCard,
  shareTourByEmail,
} from './tourPackageControllers';
import { upload } from '../../config/cloudinary';
import { authenticate } from '../../middlewares/firebaseAuth';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.post(
  '/categories',
  adminAuthMiddleware,
  upload.single('image'),
  createCategory,
);
router.get('/categories', getCategories);
router.put(
  '/categories/:categoryId',
  adminAuthMiddleware,
  upload.single('image'),
  updateCategory,
);
router.delete('/categories/:categoryId', adminAuthMiddleware, deleteCategory);

router.post(
  '/tour-package-cards',
  adminAuthMiddleware,
  upload.array('galleryImages', 10),
  createTourPackageCard,
);
router.get('/tour-package-cards', getTourPackageCards);
router.put(
  '/tour-package-cards/:cardId',
  adminAuthMiddleware,
  upload.array('galleryImages', 10),
  updateTourPackageCard,
);
router.delete('/tour-package-cards/:cardId', deleteTourPackageCard);

// Add this line with your other routes
router.post('/share-email', shareTourByEmail);
export const tourPackageRouter = router;
