import { z } from 'zod';

export const pageTitlesValidationSchema = z.object({
  offersTitle: z.string().trim().min(1, 'Offers title is required'),
  offersSubtitle: z.string().trim().min(1, 'Offers subtitle is required'),
  servicesTitle: z.string().trim().min(1, 'Services title is required'),
  worldTitle: z.string().trim().min(1, 'World title is required'),
  indiaTitle: z.string().trim().min(1, 'India title is required'),
  blogsTitle: z.string().trim().min(1, 'Blogs title is required'),
  podcastTitle: z.string().trim().min(1, 'Podcast title is required'),
});

export const pageTitlesUpdateValidationSchema = pageTitlesValidationSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
