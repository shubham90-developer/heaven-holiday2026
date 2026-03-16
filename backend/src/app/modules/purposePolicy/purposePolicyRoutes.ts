import { Router } from 'express';
import {
  getPurposePolicy,
  updateMainFields,
  addCard,
  updateCard,
  deleteCard,
} from './purposepolicyController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getPurposePolicy);
router.put('/main-fields', adminAuthMiddleware, updateMainFields);

// Add upload.single('img') middleware to these two routes:
router.post('/card', adminAuthMiddleware, upload.single('img'), addCard);
router.put('/card', adminAuthMiddleware, upload.single('img'), updateCard);
router.delete('/card', adminAuthMiddleware, deleteCard);

export const purposePolicyRouter = router;
