// validations/feedbackValidation.ts
import { z } from 'zod';

export const feedbackValidationSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name cannot exceed 100 characters' })
    .trim(),

  mobile: z.string().trim(),

  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase()
    .trim(),

  experience: z
    .string()
    .min(10, { message: 'Experience must be at least 10 characters' })
    .max(2000, { message: 'Experience cannot exceed 2000 characters' })
    .trim(),
});

export type FeedbackFormData = z.infer<typeof feedbackValidationSchema>;
