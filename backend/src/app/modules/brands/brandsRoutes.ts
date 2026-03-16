import express from 'express';
import {
  createBrand,
  getAllBrands,
  updateBrandById,
  deleteBrandById,
  createIndustry,
  getAllIndustries,
  updateIndustryById,
  deleteIndustryById,
  getBrandsSection,
  updateBrandsSectionHeading,
} from './brandsController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/section', getBrandsSection);

router.patch('/section', adminAuthMiddleware, updateBrandsSectionHeading);

router.post('/brands', adminAuthMiddleware, createBrand);

router.get('/brands', adminAuthMiddleware, getAllBrands);

router.patch('/brands/:id', adminAuthMiddleware, updateBrandById);

router.delete('/brands/:id', adminAuthMiddleware, deleteBrandById);

router.post(
  '/industries',
  adminAuthMiddleware,
  upload.single('image'),
  createIndustry,
);

router.get('/industries', adminAuthMiddleware, getAllIndustries);

router.patch(
  '/industries/:id',
  adminAuthMiddleware,
  upload.single('image'),
  updateIndustryById,
);

router.delete('/industries/:id', adminAuthMiddleware, deleteIndustryById);

export const brandsRouter = router;
