import express from 'express';
import {
  createEnquiry,
  getAllEnquiries,
  updateEnquiry,
  deleteEnquiry,
} from './enquiryController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.post('/', createEnquiry);
router.get('/', getAllEnquiries);
router.put('/:id', adminAuthMiddleware, updateEnquiry);
router.delete('/:id', adminAuthMiddleware, deleteEnquiry);

export const enquiryRouter = router;
