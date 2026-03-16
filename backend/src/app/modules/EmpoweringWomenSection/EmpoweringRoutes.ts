// routes/empowering.routes.ts
import express from 'express';
import { getEmpowering, updateEmpowering } from './empoweringController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// GET /api/empowering - Get empowering content
router.get('/', getEmpowering);

// PUT /api/empowering - Update empowering content
router.put('/', adminAuthMiddleware, updateEmpowering);

export const EmpoweringRouter = router;
