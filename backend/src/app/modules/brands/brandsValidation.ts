import { z } from 'zod';

export const brandValidation = z.object({
  name: z.string().min(1, 'Brand name is required').trim(),
  industry: z.string().min(1, 'Industry is required').trim(),
  isActive: z.boolean().optional().default(true),
});

export const brandUpdateValidation = z.object({
  name: z.string().min(1, 'Brand name is required').trim().optional(),
  industry: z.string().min(1, 'Industry is required').trim().optional(),
  isActive: z.boolean().optional(),
});

export const industryValidation = z.object({
  image: z.string().min(1, 'Industry image is required').trim(),
  isActive: z.boolean().optional().default(true),
});

export const industryUpdateValidation = z.object({
  image: z.string().min(1, 'Industry image is required').trim().optional(),
  isActive: z.boolean().optional(),
});

export const brandsSectionValidation = z.object({
  heading: z.string().min(1, 'Heading is required').trim(),
  isActive: z.boolean().optional().default(true),
});

export const brandsSectionUpdateValidation = z.object({
  heading: z.string().min(1, 'Heading is required').trim().optional(),
  isActive: z.boolean().optional(),
});
