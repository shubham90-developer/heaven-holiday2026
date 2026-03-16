import express from 'express';
import { upload } from '../../config/cloudinary';
import {
  getManagement,
  updateMainFields,
  addCard,
  updateCard,
  deleteCard,
} from './philosophyController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/management', getManagement);

router.patch('/management/main-fields', adminAuthMiddleware, updateMainFields);

router.post(
  '/management/card',
  adminAuthMiddleware,
  upload.single('image'),
  addCard,
);

router.patch(
  '/management/card',
  adminAuthMiddleware,
  upload.single('image'),
  updateCard,
);

router.delete('/management/card', adminAuthMiddleware, deleteCard);

export const philosophyRouter = router;
