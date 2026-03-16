// validation.ts
import { z } from 'zod';

export const IncludesValidationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),

  image: z
    .string()
    .min(1, 'Image is required')

    .trim(),
  status: z.enum(['active', 'inactive']).default('active'),
});

// For creating a new post (all fields required except status which has default)
export const IncludesSchema = IncludesValidationSchema;

// For updating a post (all fields optional)
export const UpdateIncludesSchema = IncludesValidationSchema.partial();

// Type inference from Zod schema
export type IncludesInput = z.infer<typeof IncludesValidationSchema>;
export type CreateIncludesInput = z.infer<typeof IncludesSchema>;
export type UpdateIncludesInput = z.infer<typeof UpdateIncludesSchema>;
