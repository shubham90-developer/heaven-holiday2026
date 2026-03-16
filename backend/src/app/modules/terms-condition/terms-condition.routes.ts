import express from 'express';
import {
  getTermsCondition,
  updateTermsCondition,
} from './terms-condition.controller';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

router.get('/', getTermsCondition);

router.put('/', adminAuthMiddleware, updateTermsCondition);

export const TermsConditionRouter = router;
