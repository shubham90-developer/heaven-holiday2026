// routes/annualReturn.routes.ts
import express from 'express';
import {
  getAnnualReturn,
  addItem,
  updateItem,
  deleteItem,
} from './returnController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/annual-return', getAnnualReturn);

router.post(
  '/annual-return/item',
  adminAuthMiddleware,
  upload.single('pdf'),
  addItem,
);

router.put(
  '/annual-return/item/:itemId',
  adminAuthMiddleware,
  upload.single('pdf'),
  updateItem,
);

router.delete('/annual-return/item/:itemId', adminAuthMiddleware, deleteItem);

export const annualReturnRouter = router;
