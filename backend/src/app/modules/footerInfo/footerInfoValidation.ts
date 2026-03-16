import { z } from 'zod';

export const footerInfoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),

  description: z.string().min(10, 'Description must be at least 50 characters'),

  isActive: z.boolean().optional(),
});
