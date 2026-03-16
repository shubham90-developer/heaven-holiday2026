import { Router } from 'express';
import {
  getAllVideoBlogs,
  createVideoBlog,
  updateVideoBlog,
  deleteVideoBlog,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from './videoBlogController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

// ========== VIDEO BLOG ROUTES ==========

// Get all video blogs
router.get('/', getAllVideoBlogs);

// Create video blog
router.post('/', adminAuthMiddleware, createVideoBlog);

// Update video blog by ID
router.put('/:id', adminAuthMiddleware, updateVideoBlog);

// Delete video blog by ID
router.delete('/:id', adminAuthMiddleware, deleteVideoBlog);

// ========== CATEGORY ROUTES ==========

// Get all categories
router.get('/categories', getAllCategories);

// Add category
router.post('/categories', adminAuthMiddleware, addCategory);

// Update category by categoryId
router.put('/categories/:categoryId', adminAuthMiddleware, updateCategory);

// Delete category by categoryId
router.delete('/categories/:categoryId', adminAuthMiddleware, deleteCategory);

export const videoBlogRouter = router;
