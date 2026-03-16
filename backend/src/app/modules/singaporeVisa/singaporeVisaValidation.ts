// validations/visaInfoValidation.ts
import { z } from 'zod';

export const visaInfoValidation = z.object({
  heading: z
    .string()
    .min(1, 'Heading is required')
    .max(500, 'Heading cannot exceed 500 characters')
    .optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type VisaInfoInput = z.infer<typeof visaInfoValidation>;
