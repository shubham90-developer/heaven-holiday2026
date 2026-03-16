// routes/blog.routes.ts
import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getWholeDocument,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment,
} from './blogsController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
import { upload } from '../../config/cloudinary';

const router = express.Router();

// ✅ SPECIFIC ROUTES FIRST - Categories (exact paths)
router.get('/categories', getAllCategories);
router.post('/categories', adminAuthMiddleware, createCategory);
router.post('/:id/comments', addComment);

// ✅ SPECIFIC ROUTES - Blogs (exact paths)
router.get('/blogs', getWholeDocument);
router.post(
  '/blogs',
  adminAuthMiddleware,
  upload.fields([{ name: 'hero', maxCount: 1 }]),
  createBlog,
);

// ✅ DYNAMIC ROUTES LAST - Category with ID
router.put('/categories/:id', adminAuthMiddleware, updateCategory);
router.delete('/categories/:id', adminAuthMiddleware, deleteCategory);

// ✅ DYNAMIC ROUTES LAST - Blog with ID
router.put(
  '/blogs/:id',
  adminAuthMiddleware,
  upload.fields([{ name: 'hero', maxCount: 1 }]),
  updateBlog,
);
router.delete('/blogs/:id', adminAuthMiddleware, deleteBlog);

export const blogsRouter = router;
