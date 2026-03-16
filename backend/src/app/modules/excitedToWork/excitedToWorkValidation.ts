// validations/excitedtowork.validation.ts
import { z } from 'zod';

export const updateExcitedToWorkSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, 'Title is required')
      .max(300, 'Title cannot exceed 300 characters')
      .optional(),
    subtitle: z
      .string()
      .trim()
      .min(1, 'Subtitle is required')
      .max(300, 'Subtitle cannot exceed 300 characters')
      .optional(),
    email: z
      .string()
      .trim()
      .email('Please provide a valid email address')
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateExcitedToWorkBody = z.infer<
  typeof updateExcitedToWorkSchema
>['body'];
