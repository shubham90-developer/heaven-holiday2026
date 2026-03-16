import { Router } from 'express';
import {
  getTourReview,
  updateMainFields,
  addReview,
  updateReview,
  deleteReview,
} from './reviewsController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getTourReview);

router.put('/update-main', adminAuthMiddleware, updateMainFields);

router.post('/review/add', adminAuthMiddleware, addReview);

router.put('/review/update/:id', adminAuthMiddleware, updateReview);

router.delete('/review/delete/:id', adminAuthMiddleware, deleteReview);

export const reviewsRouter = router;
