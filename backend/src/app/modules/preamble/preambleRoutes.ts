import express from 'express';
import {
  getPreamble,
  updateMainFields,
  addTableRow,
  updateTableRow,
  deleteTableRow,
  createPreamble,
} from './preambleController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// Get Preamble
router.get('/preamble', getPreamble);

// Update Main Fields (heading, paragraph, subtitle)
router.patch('/preamble/main-fields', adminAuthMiddleware, updateMainFields);

// Add Table Row
router.post('/preamble/table-row', adminAuthMiddleware, addTableRow);
router.post('/preamble', adminAuthMiddleware, createPreamble);

// Update Table Row
router.patch('/preamble/table-row', adminAuthMiddleware, updateTableRow);

// Delete Table Row
router.delete('/preamble/table-row', adminAuthMiddleware, deleteTableRow);

export const preambleRouter = router;
