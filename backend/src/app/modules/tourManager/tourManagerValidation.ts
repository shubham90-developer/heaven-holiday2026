import { z } from 'zod';

export const createTourManagerSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters'),

  subtitle: z
    .string()
    .trim()
    .min(1, 'Subtitle cannot be empty')
    .max(300, 'Subtitle must be less than 300 characters'),

  description: z
    .string()
    .min(1, 'Description cannot be empty')
    .max(3000, 'Description must be less than 2000 characters'),
});

export const updateTourManagerSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters')
    .optional(),

  subtitle: z
    .string()
    .trim()
    .min(1, 'Subtitle cannot be empty')
    .max(300, 'Subtitle must be less than 300 characters')
    .optional(),

  description: z
    .string()
    .min(1, 'Description cannot be empty')
    .max(3000, 'Description must be less than 2000 characters')
    .optional(),
});

export const tourManagerIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Tour Manager ID format'),
});

export type CreateTourManagerInput = z.infer<typeof createTourManagerSchema>;
export type UpdateTourManagerInput = z.infer<typeof updateTourManagerSchema>;
export type TourManagerIdInput = z.infer<typeof tourManagerIdSchema>;
