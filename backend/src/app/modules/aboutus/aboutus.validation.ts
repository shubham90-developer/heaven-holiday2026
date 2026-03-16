import { z } from 'zod';

export const aboutUsUpdateValidation = z.object({
  getaboutus: z
    .object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      video: z.string().min(1).optional(),
      thumbnail: z.string().min(1).optional(),
    })
    .optional(),
});
