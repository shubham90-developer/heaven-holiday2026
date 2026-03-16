import { z } from 'zod';

export const cityCreateValidation = z.object({
  name: z.string().min(1, 'City name is required'),
  icon: z.string().min(1, 'Icon identifier is required'),
  status: z.enum(['active', 'inactive']).optional(),
});

export const cityUpdateValidation = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
