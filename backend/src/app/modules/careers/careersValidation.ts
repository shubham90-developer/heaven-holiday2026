// validations/careersValidation.ts
import { z } from 'zod';

export const careersValidationSchema = z.object({
  title: z
    .string()
    .max(200, { message: 'Title cannot exceed 200 characters' })
    .trim()
    .optional()
    .default('Welcome to our World!'),

  description: z
    .string()
    .max(1000, { message: 'Description cannot exceed 1000 characters' })
    .trim()
    .optional()
    .default(
      'Come join our team at Heaven Holiday to experience an exciting workplace culture, fantastic colleagues, and a people-first community that empowers you to grow.',
    ),

  buttonText: z
    .string()
    .max(50, { message: 'Button text cannot exceed 50 characters' })
    .trim()
    .optional()
    .default('View current openings'),

  buttonLink: z.string().trim().optional().default('/careers'),

  videoThumbnail: z
    .string()
    .trim()
    .optional()
    .default('/assets/img/about/1.avif')
    .nullable(),

  videoUrl: z
    .string()
    .url({ message: 'Video URL must be valid' })
    .trim()
    .optional()
    .nullable()
    .default('https://www.youtube.com/embed/5acM-mzLTaU?si=YUw-L4EWkRHsn9ar'),
});

export type CareersFormData = z.infer<typeof careersValidationSchema>;
