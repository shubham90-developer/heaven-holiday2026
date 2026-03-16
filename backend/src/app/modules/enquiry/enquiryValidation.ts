import { z } from 'zod';

// Create Enquiry Validation (POST)
export const createEnquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),

  mono: z.string().trim(),

  destinations: z
    .string()
    .min(1, 'Destinations must be at least 1 characters')
    .max(200, 'Destinations cannot exceed 200 characters')
    .trim(),

  message: z
    .string()

    .max(300, 'Destinations cannot exceed 300 characters')
    .trim()
    .optional(),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .trim()
    .optional()
    .or(z.literal('-')),
  modeOfCommunication: z.enum(['call', 'email']).optional().default('call'),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export const updateEnquirySchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId format'),

  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),

  mono: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .trim()
    .optional(),

  destinations: z
    .string()
    .min(1, 'Destinations must be at least 1 characters')
    .max(200, 'Destinations cannot exceed 200 characters')
    .trim()
    .optional(),
  message: z
    .string()
    .min(10, 'message must be atleast 10 characters')
    .max(300, 'Destinations cannot exceed 300 characters')
    .trim()
    .optional(), // ← Add this

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .trim()
    .optional(),
  modeOfCommunication: z.enum(['call', 'email']).optional().default('call'),
  status: z.enum(['active', 'inactive']).optional(),
});

// Delete Enquiry Validation (DELETE)
export const deleteEnquirySchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId format'),
});

// Type exports
export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;

export type DeleteEnquiryInput = z.infer<typeof deleteEnquirySchema>;
