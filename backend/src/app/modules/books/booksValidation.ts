import { z } from 'zod';

// Base Book validation schema
const bookBaseSchema = {
  coverImg: z
    .string()
    .min(1, 'Cover image is required')

    .url('Cover image must be a valid URL')
    .min(1, 'Cover image cannot be empty'),

  title: z
    .string()
    .min(1, 'Cover image is required')

    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters'),

  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .min(1, 'At least one image is required'),
  status: z.enum(['active', 'inactive']).default('active').optional(),
};

// CREATE Book Schema (all fields required)
export const createBookSchema = z.object({
  body: z.object({
    coverImg: bookBaseSchema.coverImg,
    title: bookBaseSchema.title,
    images: bookBaseSchema.images,
    status: bookBaseSchema.status,
  }),
});

// UPDATE Book Schema (all fields optional for partial updates)
export const updateBookSchema = z.object({
  body: z.object({
    coverImg: z
      .string()
      .url('Cover image must be a valid URL')
      .min(1, 'Cover image cannot be empty')
      .optional(),

    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(200, 'Title must be less than 200 characters')
      .optional(),

    images: z
      .array(z.string().url('Each image must be a valid URL'))
      .min(1, 'At least one image is required')
      .optional(),

    status: z.enum(['active', 'inactive']).optional(),
  }),
});

// Export types for TypeScript
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
