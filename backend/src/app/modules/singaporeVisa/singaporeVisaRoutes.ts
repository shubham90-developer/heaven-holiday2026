// routes/visaInfo.routes.ts
import express from 'express';
import { getVisaInfo, updateVisaInfo } from './singaporeVisaController.';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

router.get('/visa-info', getVisaInfo);

router.put('/visa-info', adminAuthMiddleware, updateVisaInfo);

export const visaInfoRouter = router;
