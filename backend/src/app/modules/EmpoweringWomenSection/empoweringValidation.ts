import { z } from 'zod';

export const getEmpoweringSchema = z.object({
  query: z.object({
    id: z.string().optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => val === 'true'),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, { message: 'Page must be greater than 0' }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val > 0 && val <= 100, {
        message: 'Limit must be between 1 and 100',
      }),
  }),
});

export const updateEmpoweringSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(200, 'Title cannot exceed 200 characters')
        .optional(),
      subtitle: z
        .string()
        .trim()
        .min(1, 'Subtitle is required')
        .max(300, 'Subtitle cannot exceed 300 characters')
        .optional(),
      paragraphs: z
        .array(z.string().trim().min(1, 'Paragraph cannot be empty'))
        .min(1, 'At least one paragraph is required')
        .optional(),
      footerTitle: z
        .string()
        .trim()
        .min(1, 'Footer title is required')
        .max(200, 'Footer title cannot exceed 200 characters')
        .optional(),
      disclaimer: z
        .string()
        .trim()
        .min(1, 'Disclaimer is required')
        .max(1000, 'Disclaimer cannot exceed 1000 characters')
        .optional(),
      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

// Type exports for use in controllers
export type GetEmpoweringQuery = z.infer<typeof getEmpoweringSchema>['query'];
export type UpdateEmpoweringParams = z.infer<typeof updateEmpoweringSchema>;
export type UpdateEmpoweringBody = z.infer<
  typeof updateEmpoweringSchema
>['body'];
