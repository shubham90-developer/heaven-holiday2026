import { Router } from 'express';
import {
  getPrinciple,
  updateMainFields,
  addDetail,
  updateDetail,
  deleteDetail,
} from './principlesController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getPrinciple);

router.put('/', adminAuthMiddleware, updateMainFields);

router.post('/details', adminAuthMiddleware, addDetail);

router.put('/details/:id', adminAuthMiddleware, updateDetail);

router.delete('/details/:id', adminAuthMiddleware, deleteDetail);

export const principleRouter = router;
