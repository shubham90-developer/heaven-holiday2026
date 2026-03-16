import { z } from 'zod';

export const heroBannerValidation = z.object({
  image: z.string().min(1, 'Banner image is required'), // Must be a string (Cloudinary URL)
  link: z.string().min(1, 'Link is required'), // Non-empty string
  status: z.enum(['active', 'inactive']).default('inactive'),
});
