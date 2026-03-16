// validation/howWeHire.validation.ts
import { z } from 'zod';

export const HowWeHireStepSchema = z.object({
  title: z
    .string()
    .min(1, 'Step title is required')
    .max(100, 'Step title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Step description is required')
    .max(1000, 'Step description cannot exceed 1000 characters'),
  img: z.string().min(1, 'Step image URL is required'),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const HowWeHireSchema = z.object({
  heading: z
    .string()
    .min(1, 'Heading is required')
    .max(100, 'Heading cannot exceed 100 characters')
    .default('How we hire'),
  introText: z
    .string()
    .min(1, 'Intro text is required')
    .max(1000, 'Intro text cannot exceed 1000 characters'),
  subText: z
    .string()
    .min(1, 'Sub text is required')
    .max(1000, 'Sub text cannot exceed 1000 characters'),
  steps: z.array(HowWeHireStepSchema).default([]),
});

// TypeScript inference
export type HowWeHireStep = z.infer<typeof HowWeHireStepSchema>;
export type HowWeHire = z.infer<typeof HowWeHireSchema>;
