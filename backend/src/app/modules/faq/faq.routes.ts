// routes/faq.routes.ts
import express from 'express';
import {
  getAllFAQs,
  getAllCategories,
  getFAQsByCategory,
  createCategory,
  createFAQ,
  updateCategory,
  updateFAQ,
  deleteCategory,
  deleteFAQ,
} from './faq.controller';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// GET routes
router.get('/', getAllFAQs); // Get all FAQs and categories
router.get('/categories', getAllCategories); // Get only categories
router.get('/category/:category', getFAQsByCategory); // Get FAQs by category name

// POST routes
router.post('/category', adminAuthMiddleware, createCategory); // Create new category
router.post('/faq', adminAuthMiddleware, createFAQ); // Create new FAQ

// PUT routes
router.put('/category/:categoryId', adminAuthMiddleware, updateCategory); // Update category
router.put('/faq/:faqId', adminAuthMiddleware, updateFAQ); // Update FAQ

// DELETE routes
router.delete('/category/:categoryId', adminAuthMiddleware, deleteCategory); // Delete category
router.delete('/faq/:faqId', adminAuthMiddleware, deleteFAQ); // Delete FAQ

export const faqRouter = router;
