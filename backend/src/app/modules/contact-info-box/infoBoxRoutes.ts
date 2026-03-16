// routes/contactfeatures.routes.ts
import express from 'express';
import {
  getContactFeatures,
  createContactFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  updateHighlight,
} from './infoBoxController';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = express.Router();

// GET route
router.get('/', getContactFeatures); // Get all contact features

// POST routes
router.post('/', adminAuthMiddleware, createContactFeatures); // Create contact features document
router.post('/feature', adminAuthMiddleware, createFeature); // Create new feature

// PUT routes
router.put('/feature/:featureId', adminAuthMiddleware, updateFeature); // Update specific feature
router.put('/highlight', adminAuthMiddleware, updateHighlight); // Update highlight section

// DELETE route
router.delete('/feature/:featureId', adminAuthMiddleware, deleteFeature); // Delete specific feature

export const contactInfoBoxRouter = router;
