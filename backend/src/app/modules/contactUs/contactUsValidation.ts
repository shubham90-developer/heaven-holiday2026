import { z } from 'zod';

export const contactDetailsZodSchema = z
  .object({
    offices: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        mapLink: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val || val === '' || z.string().url().safeParse(val).success,
            { message: 'Invalid map link' },
          ),
      })
      .optional(),

    callUs: z
      .object({
        title: z.string().optional(),
        phoneNumbers: z
          .array(
            z.string().refine((val) => val.length >= 10, {
              message: 'Phone number must be at least 10 digits',
            }),
          )
          .optional(),
      })
      .optional(),

    writeToUs: z
      .object({
        title: z.string().optional(),
        emails: z.array(z.string().email('Invalid email address')).optional(),
      })
      .optional(),

    socialLinks: z
      .object({
        facebook: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val || val === '' || z.string().url().safeParse(val).success,
            { message: 'Invalid Facebook URL' },
          ),
        youtube: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val || val === '' || z.string().url().safeParse(val).success,
            { message: 'Invalid YouTube URL' },
          ),
        linkedin: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val || val === '' || z.string().url().safeParse(val).success,
            { message: 'Invalid LinkedIn URL' },
          ),
        instagram: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val || val === '' || z.string().url().safeParse(val).success,
            { message: 'Invalid Instagram URL' },
          ),
      })
      .optional(),
  })
  .partial();
