import { z } from 'zod';

// For creating new items - all fields required
export const itemValidationSchema = z.object({
  icon: z.string().min(1, 'Icon is required'),
  iconTitle: z.string().min(1, 'Icon title is required'),
  iconDescription: z.string().min(1, 'Icon description is required'),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

// For updating items - all fields optional (partial update)
export const itemUpdateValidationSchema = z.object({
  icon: z.string().min(1, 'Icon URL cannot be empty').optional(),
  iconTitle: z.string().min(1, 'Icon title cannot be empty').optional(),
  iconDescription: z
    .string()
    .min(1, 'Icon description cannot be empty')
    .optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// For updating only main fields (title, subtitle)
export const mainFieldsUpdateValidationSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').trim().optional(),
  subtitle: z.string().min(1, 'Subtitle cannot be empty').trim().optional(),
});

export const mainValidationSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  subtitle: z.string().min(1, 'Subtitle is required').trim(),
  items: z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, z.array(itemValidationSchema).optional().default([])),
});

export const updateValidationSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').trim().optional(),
  subtitle: z.string().min(1, 'Subtitle cannot be empty').trim().optional(),
  items: z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, z.array(itemUpdateValidationSchema).optional()),
});

export type MainInput = z.infer<typeof mainValidationSchema>;
export type UpdateMainInput = z.infer<typeof updateValidationSchema>;
export type ItemUpdateInput = z.infer<typeof itemUpdateValidationSchema>;
export type MainFieldsUpdateInput = z.infer<
  typeof mainFieldsUpdateValidationSchema
>;
