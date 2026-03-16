// jobApplication.validation.ts
import { z } from 'zod';

// File validation helper
const MAX_FILE_SIZE = 500 * 1024; // 500 KB
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Create Job Application Schema
export const createJobApplicationSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name cannot exceed 100 characters' })
    .trim(),

  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      {
        message: 'Please provide a valid phone number',
      },
    )
    .trim(),

  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),

  currentCity: z
    .string()
    .min(2, { message: 'Current city is required' })
    .max(100, { message: 'City name cannot exceed 100 characters' })
    .trim(),

  yearsOfExperience: z.coerce
    .number()
    .int({ message: 'Years of experience must be a whole number' })
    .min(0, { message: 'Years of experience cannot be negative' })
    .max(50, { message: 'Years of experience cannot exceed 50' }),

  noticePeriod: z
    .string()
    .min(1, { message: 'Notice period is required' })
    .max(50, { message: 'Notice period cannot exceed 50 characters' })
    .trim(),

  joiningAvailability: z
    .string()
    .min(1, { message: 'Joining availability is required' })
    .max(50, { message: 'Joining availability cannot exceed 50 characters' })
    .trim(),

  currentCTC: z
    .string()
    .min(1, { message: 'Current CTC is required' })
    .max(50, { message: 'Current CTC cannot exceed 50 characters' })
    .trim(),

  expectedCTC: z
    .string()
    .min(1, { message: 'Expected CTC is required' })
    .max(50, { message: 'Expected CTC cannot exceed 50 characters' })
    .trim(),

  resume: z.string().min(1, { message: 'Resume is required' }),

  status: z
    .enum(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'], {
      message: 'Invalid status',
    })
    .optional()
    .default('pending'),
});

// Update Job Application Schema (all fields optional except status validation)
export const updateJobApplicationSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name cannot exceed 100 characters' })
    .trim()
    .optional(),

  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      {
        message: 'Please provide a valid phone number',
      },
    )
    .trim()
    .optional(),

  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim()
    .optional(),

  currentCity: z
    .string()
    .min(2, { message: 'Current city is required' })
    .max(100, { message: 'City name cannot exceed 100 characters' })
    .trim()
    .optional(),

  yearsOfExperience: z.coerce
    .number()
    .int({ message: 'Years of experience must be a whole number' })
    .min(0, { message: 'Years of experience cannot be negative' })
    .max(50, { message: 'Years of experience cannot exceed 50' })
    .optional(),

  noticePeriod: z
    .string()
    .min(1, { message: 'Notice period is required' })
    .max(50, { message: 'Notice period cannot exceed 50 characters' })
    .trim()
    .optional(),

  joiningAvailability: z
    .string()
    .min(1, { message: 'Joining availability is required' })
    .max(50, { message: 'Joining availability cannot exceed 50 characters' })
    .trim()
    .optional(),

  currentCTC: z
    .string()
    .min(1, { message: 'Current CTC is required' })
    .max(50, { message: 'Current CTC cannot exceed 50 characters' })
    .trim()
    .optional(),

  expectedCTC: z
    .string()
    .min(1, { message: 'Expected CTC is required' })
    .max(50, { message: 'Expected CTC cannot exceed 50 characters' })
    .trim()
    .optional(),

  resume: z.string().min(1, { message: 'Resume is required' }).optional(),

  status: z
    .enum(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'], {
      message: 'Invalid status',
    })
    .optional(),
});

// Update Status Only Schema
export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'], {
    message:
      'Status must be one of: pending, reviewed, shortlisted, rejected, hired',
  }),
});

// Query Schema for filtering applications
export const jobApplicationQuerySchema = z.object({
  status: z
    .enum(['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'])
    .optional(),

  page: z
    .string()
    .regex(/^\d+$/, { message: 'Page must be a number' })
    .transform(Number)
    .refine((val) => val > 0, { message: 'Page must be greater than 0' })
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, { message: 'Limit must be a number' })
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    })
    .optional(),
  search: z.string().trim().optional(),
});

export type CreateJobApplicationInput = z.infer<
  typeof createJobApplicationSchema
>;
export type UpdateJobApplicationInput = z.infer<
  typeof updateJobApplicationSchema
>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type JobApplicationQueryParams = z.infer<
  typeof jobApplicationQuerySchema
>;
