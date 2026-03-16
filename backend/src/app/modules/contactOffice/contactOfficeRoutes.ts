import { Router } from 'express';
import {
  getAllOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice,
  updateOfficeTimes,
  addHoliday,
  removeHoliday,
  getOfficeHolidays,
  checkOfficeStatus,
  getOfficeSchedule,
} from './contactOffice.Controller';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

// Basic CRUD operations
router.get('/', getAllOffices);
router.get('/:id', getOfficeById);
router.post('/', adminAuthMiddleware, createOffice);
router.put('/:id', adminAuthMiddleware, updateOffice);
router.delete('/:id', adminAuthMiddleware, deleteOffice);

// Office times management
router.put('/:id/times', adminAuthMiddleware, updateOfficeTimes);

// Holiday management
router.post('/:id/holidays', adminAuthMiddleware, addHoliday);
router.delete('/:id/holidays', adminAuthMiddleware, removeHoliday);
router.get('/:id/holidays', getOfficeHolidays);

// Status and schedule
router.get('/:id/status', checkOfficeStatus);
router.get('/:id/schedule', getOfficeSchedule);

export const contactOfficeRouter = router;
