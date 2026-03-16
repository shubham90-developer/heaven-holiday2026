import { z } from 'zod';

export const travelDealBannerValidation = z.object({
  image: z.string().min(1, 'Banner image is required'),
  status: z.enum(['active', 'inactive']).default('inactive'),
});
