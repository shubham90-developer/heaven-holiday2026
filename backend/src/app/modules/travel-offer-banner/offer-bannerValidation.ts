// validations/celebrateValidation.ts
import { z } from 'zod';

export const slideValidation = z.object({
  image: z
    .string()
    .min(1, 'Image is required')
    .max(500, 'Image URL cannot exceed 500 characters'),
  link: z
    .string()
    .min(1, 'Link is required')
    .max(500, 'Link cannot exceed 500 characters')
    .default('/tour-details'),
  order: z
    .number()
    .int('Order must be an integer')
    .min(1, 'Order must be at least 1')
    .max(100, 'Order cannot exceed 100'),
  status: z.enum(['active', 'inactive']).default('active').optional(),
});

export const celebrateValidation = z.object({
  heading: z
    .string()
    .min(1, 'Heading is required')
    .max(200, 'Heading cannot exceed 200 characters')
    .optional(),
  slides: z.array(slideValidation).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type SlideInput = z.infer<typeof slideValidation>;
export type CelebrateInput = z.infer<typeof celebrateValidation>;
