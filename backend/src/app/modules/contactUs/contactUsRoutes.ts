import { Router } from 'express';
import {
  getContactDetails,
  updateContactDetails,
  patchContactDetails,
} from './contactUsController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

// GET contact details
router.get('/', getContactDetails);

// PUT -> full update / create
router.put('/', adminAuthMiddleware, updateContactDetails);

// PATCH -> partial update
router.patch('/', adminAuthMiddleware, patchContactDetails);

export const contactRouter = router;
