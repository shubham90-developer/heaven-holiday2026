import { Router } from 'express';
import {
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
} from './partnerController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getAllCards);
router.post('/', adminAuthMiddleware, upload.single('icon'), createCard);
router.put('/:id', adminAuthMiddleware, upload.single('icon'), updateCard);
router.delete('/:id', adminAuthMiddleware, deleteCard);

export const becomePartnerRouter = router;
