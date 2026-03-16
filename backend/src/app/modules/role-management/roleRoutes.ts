// src/modules/role/roleRoutes.ts

import { Router } from 'express';
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
  createUser,
  getAllUsers,
  changeUserRole,
  deleteUser,
} from './roleControllers';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';

const router = Router();

router.post('/roles', adminAuthMiddleware, createRole);
router.get('/roles', adminAuthMiddleware, getAllRoles);
router.patch('/roles/:id', adminAuthMiddleware, updateRole);
router.delete('/roles/:id', adminAuthMiddleware, deleteRole);

router.post('/users', adminAuthMiddleware, createUser);
router.get('/users', adminAuthMiddleware, getAllUsers);
router.patch('/users/:id/role', adminAuthMiddleware, changeUserRole);
router.delete('/users/:id', adminAuthMiddleware, deleteUser);

export const roleRouter = router;
