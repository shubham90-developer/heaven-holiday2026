import express from 'express';
import {
  getPrivacyPolicy,
  updatePrivacyPolicy,
} from './privacy-policy.controller';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/', getPrivacyPolicy);

router.put('/', adminAuthMiddleware, updatePrivacyPolicy);

export const privacyPolicyRouter = router;
