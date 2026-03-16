// validations/annualReturnValidation.ts
import { z } from 'zod';

export const annualReturnItemValidation = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  particulars: z
    .string()
    .min(1, 'Particulars (PDF URL) is required')
    .max(1000, 'Particulars cannot exceed 1000 characters'),
  status: z.enum(['active', 'inactive']).default('active').optional(),
});

export const annualReturnValidation = z.object({
  items: z
    .array(annualReturnItemValidation)
    .max(50, 'Maximum 50 items allowed')
    .optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type AnnualReturnItemInput = z.infer<typeof annualReturnItemValidation>;
export type AnnualReturnInput = z.infer<typeof annualReturnValidation>;
