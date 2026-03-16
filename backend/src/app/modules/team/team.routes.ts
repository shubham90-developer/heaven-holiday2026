import express from 'express';
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from './team.controller';
import { auth } from '../../middlewares/authMiddleware';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// Public routes
router.get('/', getTeams);
router.get('/:id', getTeamById);

// Admin routes
router.post('/', adminAuthMiddleware, upload.single('image'), createTeam);
router.put('/:id', adminAuthMiddleware, upload.single('image'), updateTeam);
router.delete('/:id', adminAuthMiddleware, deleteTeam);

export const teamRouter = router;
