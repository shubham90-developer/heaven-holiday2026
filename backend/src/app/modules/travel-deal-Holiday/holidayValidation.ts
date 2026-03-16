// validation/holidaySectionValidation.ts
import { z } from 'zod';

export const featureSchema = z.object({
  title: z
    .string()
    .min(1, 'Feature title is required')
    .max(100, 'Feature title cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Feature description is required')
    .max(500, 'Feature description cannot exceed 500 characters')
    .trim(),
});

export const holidaySectionValidation = z.object({
  heading: z
    .string()
    .min(1, 'Heading is required')
    .max(200, 'Heading cannot exceed 200 characters')
    .trim()
    .optional(),
  subheading: z
    .string()
    .min(1, 'Subheading is required')
    .max(500, 'Subheading cannot exceed 500 characters')
    .trim()
    .optional(),
  features: z.array(featureSchema).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
