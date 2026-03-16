// validation/content.ts
import { z } from 'zod';

export const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'sbtitle is required'),
  description: z.string().min(1, 'Description is required'),
  button: z
    .object({
      text: z.string().min(1, 'Button text is required'),
      link: z.string().url('Button link must be a valid URL'),
    })
    .optional(),
});

export type ContentValidation = z.infer<typeof contentSchema>;
