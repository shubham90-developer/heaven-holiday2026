// routes/department.route.ts
import express from 'express';
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus,
} from './openingController';

import {
  createLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
  toggleLocationStatus,
} from './openingController';

import {
  getJobPage,
  updateJobPageHeader,
  createJobItem,
  getAllJobItems,
  updateJobItem,
  deleteJobItem,
  updateJobItemStatus,
} from './openingController';
const router = express.Router();
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
router.post('/department', adminAuthMiddleware, createDepartment);
router.get('/department', getAllDepartments);

router.put('/department/:id', adminAuthMiddleware, updateDepartment);
router.delete('/department/:id', adminAuthMiddleware, deleteDepartment);
router.patch(
  '/department/:id/toggle-status',
  adminAuthMiddleware,
  toggleDepartmentStatus,
);

router.post('/location', adminAuthMiddleware, createLocation);
router.get('/location', getAllLocations);

router.put('/location/:id', adminAuthMiddleware, updateLocation);
router.delete('/location/:id', adminAuthMiddleware, deleteLocation);
router.patch(
  '/location/:id/toggle-status',
  adminAuthMiddleware,
  toggleLocationStatus,
);

// Job Page (title, subtitle)
router.get('/job/page', getJobPage);
router.patch('/job/page/header', adminAuthMiddleware, updateJobPageHeader);

// Job Items CRUD
router.post('/job/items', adminAuthMiddleware, createJobItem);
router.get('/job/items', getAllJobItems);

router.put('/job/items/:jobId', adminAuthMiddleware, updateJobItem);
router.delete('/job/items/:jobId', adminAuthMiddleware, deleteJobItem);
router.patch(
  '/job/items/:jobId/status',
  adminAuthMiddleware,
  updateJobItemStatus,
);

export const JobRouter = router;
export const LocationRouter = router;
export const DepartmentRouter = router;
