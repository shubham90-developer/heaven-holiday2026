// faq.route.ts
import { Router } from 'express';
import { createFAQ, getAllFAQs, updateFAQ, deleteFAQ } from './faqControllers';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

// Create a new FAQ
router.post('/', createFAQ);

// Get all FAQs
router.get('/', adminAuthMiddleware, getAllFAQs);

// Update an FAQ by ID
router.patch('/:id', adminAuthMiddleware, updateFAQ);

// Delete an FAQ by ID
router.delete('/:id', adminAuthMiddleware, deleteFAQ);

export const CSRFAQRouter = router;
