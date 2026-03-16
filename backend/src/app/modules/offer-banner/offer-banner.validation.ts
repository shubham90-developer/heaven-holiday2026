import { z } from 'zod';

export const offerBannerValidation = z.object({
  image: z.string().min(1, 'Banner image is required'),
  link: z.string().min(1, 'Link is required'),
  status: z.enum(['active', 'inactive']).default('inactive'),
});
