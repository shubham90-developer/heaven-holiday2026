import { Router } from 'express';
import {
  getAllForms,
  createForm,
  updateFormStatus,
  deleteForm,
} from './formController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getAllForms);
router.post('/', adminAuthMiddleware, createForm);
router.patch('/:id/status', adminAuthMiddleware, updateFormStatus);
router.delete('/:id', adminAuthMiddleware, deleteForm);

export const becomePartnerFormRouter = router;
