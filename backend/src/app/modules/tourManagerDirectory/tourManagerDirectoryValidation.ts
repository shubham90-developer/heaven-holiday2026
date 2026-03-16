import { z } from 'zod';

const managerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Manager name is required')
    .max(100, 'Manager name must be less than 100 characters'),

  image: z.string().min(1, 'Manager image is required'),

  status: z.enum(['Active', 'Inactive']).optional().default('Active'),
});

export const createTourManagerDirectorySchema = z.object({
  heading: z
    .string()
    .trim()
    .min(1, 'Heading is required')
    .max(200, 'Heading must be less than 200 characters'),

  managers: z.array(managerSchema).optional().default([]),
});

export const updateTourManagerDirectorySchema = z.object({
  heading: z
    .string()
    .trim()
    .min(1, 'Heading cannot be empty')
    .max(200, 'Heading must be less than 200 characters')
    .optional(),

  managers: z.array(managerSchema).optional(),
});

export const addManagerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Manager name is required')
    .max(100, 'Manager name must be less than 100 characters'),

  image: z.string().min(1, 'Manager image is required'),

  status: z.enum(['Active', 'Inactive']).optional().default('Active'),
});

export const updateManagerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Manager name cannot be empty')
    .max(100, 'Manager name must be less than 100 characters')
    .optional(),

  image: z.string().min(1, 'Manager image cannot be empty').optional(),

  status: z.enum(['Active', 'Inactive']).optional(),
});

export type CreateTourManagerDirectoryInput = z.infer<
  typeof createTourManagerDirectorySchema
>;
export type UpdateTourManagerDirectoryInput = z.infer<
  typeof updateTourManagerDirectorySchema
>;
export type AddManagerInput = z.infer<typeof addManagerSchema>;
export type UpdateManagerInput = z.infer<typeof updateManagerSchema>;
