import { z } from 'zod';

export const galleryInfoValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
});

export const imageValidation = z.object({
  url: z.string().url('Invalid image URL'),
  status: z.enum(['active', 'inactive']).optional(), // ✅ ADD THIS
});
