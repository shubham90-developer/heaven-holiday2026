import express from 'express';
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  addImagesToBook,
  removeImageFromBook,
} from './booksController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// GET all books
router.get('/', getAllBooks);

router.post(
  '/',
  adminAuthMiddleware,
  upload.fields([{ name: 'coverImg', maxCount: 1 }, { name: 'images' }]),
  createBook,
);

// UPDATE book

router.put(
  '/:id',
  adminAuthMiddleware,
  upload.fields([{ name: 'coverImg', maxCount: 1 }, { name: 'images' }]),
  updateBook,
);

// DELETE book
router.delete('/:id', adminAuthMiddleware, deleteBook);

router.post(
  '/:id/add-images',
  adminAuthMiddleware,
  upload.array('images'),
  addImagesToBook,
);

// REMOVE single image from book
router.delete('/:id/remove-image', adminAuthMiddleware, removeImageFromBook);

export const booksRouter = router;
