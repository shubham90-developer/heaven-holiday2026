// validations/departmentValidation.ts
import { z } from 'zod';

export const departmentValidationSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Department name must be at least 2 characters' })
    .max(100, { message: 'Department name cannot exceed 100 characters' })
    .trim(),

  isActive: z.boolean().optional().default(true),
});

export const locationValidationSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Location name must be at least 2 characters' })
    .max(100, { message: 'Location name cannot exceed 100 characters' })
    .trim(),

  isActive: z.boolean().optional().default(true),
});

export const jobItemValidationSchema = z.object({
  department: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid department ID' }),

  jobTitle: z
    .string()
    .min(5, { message: 'Job title must be at least 5 characters' })
    .max(200, { message: 'Job title cannot exceed 200 characters' })
    .trim(),

  jobDescription: z
    .string()
    .min(5, { message: 'Job description must be at least 5 characters' })
    .max(5000, { message: 'Job description cannot exceed 700 characters' }),

  type: z
    .enum(['Full Time', 'Part Time', 'Contract', 'Internship'], {
      message: 'Please select a valid job type',
    })
    .default('Full Time'),

  location: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid location ID' }),

  url: z.string().trim().default('/careers/careers-details'),

  status: z
    .enum(['active', 'inactive', 'closed'], {
      message: 'Please select a valid status',
    })
    .optional()
    .default('active'),
});

export const jobValidationSchema = z.object({
  title: z
    .string()
    .max(200, { message: 'Title cannot exceed 200 characters' })
    .trim()
    .optional()
    .default('Current Openings'),

  subtitle: z
    .string()
    .max(500, { message: 'Subtitle cannot exceed 500 characters' })
    .trim()
    .optional()
    .default(
      "We're currently looking to fill the following roles on our team.",
    ),

  jobs: z.array(jobItemValidationSchema).optional().default([]),
});

export type JobItemFormData = z.infer<typeof jobItemValidationSchema>;
export type JobFormData = z.infer<typeof jobValidationSchema>;
export type LocationFormData = z.infer<typeof locationValidationSchema>;
export type DepartmentFormData = z.infer<typeof departmentValidationSchema>;
