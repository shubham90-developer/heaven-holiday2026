import { Router } from 'express';
import { getFooterInfo, updateFooterInfo } from './footerInfoController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getFooterInfo);

router.put('/', adminAuthMiddleware, updateFooterInfo);

export const footerInfoRouter = router;
