import { z } from 'zod';

// Allowed status values
const statusEnum = ['active', 'inactive', 'draft'] as const;

// Zod validation schema for creating FAQ
export const createFAQSchema = z.object({
  question: z
    .string()
    .min(5, { message: 'Question must be at least 5 characters long' })
    .max(500, { message: 'Question cannot exceed 500 characters' }),

  answer: z
    .string()
    .min(10, { message: 'Answer must be at least 10 characters long' })
    .max(2000, { message: 'Answer cannot exceed 2000 characters' }),

  status: z
    .enum(statusEnum, {
      // message works here as `message`, not errorMap
      message: 'Status must be one of: active, inactive, draft',
    })
    .default('active'),
});

// Zod validation schema for updating FAQ (all fields optional)
export const updateFAQSchema = z.object({
  question: z
    .string()
    .min(5, { message: 'Question must be at least 5 characters long' })
    .max(500, { message: 'Question cannot exceed 500 characters' })
    .optional(),

  answer: z
    .string()
    .min(10, { message: 'Answer must be at least 10 characters long' })
    .max(2000, { message: 'Answer cannot exceed 2000 characters' })
    .optional(),

  status: z
    .enum(statusEnum, {
      message: 'Status must be one of: active, inactive, draft',
    })
    .optional(),
});

// Zod validation schema for query parameters
export const faqQuerySchema = z.object({
  status: z.enum(statusEnum).optional(),

  page: z
    .string()
    .regex(/^\d+$/, { message: 'Page must be a number' })
    .transform(Number)
    .refine((val) => val > 0, { message: 'Page must be greater than 0' })
    .optional()
    .default(1),

  limit: z
    .string()
    .regex(/^\d+$/, { message: 'Limit must be a number' })
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    })
    .optional()
    .default(10),

  search: z.string().trim().optional(),
});

// Type exports
export type CreateFAQInput = z.infer<typeof createFAQSchema>;
export type UpdateFAQInput = z.infer<typeof updateFAQSchema>;
export type FAQQueryParams = z.infer<typeof faqQuerySchema>;
