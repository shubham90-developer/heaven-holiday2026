import { z } from 'zod';

// ---------- ENUMS ----------
export const StatusEnum = z.enum(['active', 'inactive', 'draft']);
export const CategoryStatusEnum = z.enum(['active', 'inactive']);

// ========== VIDEO BLOG ==========

export const videoBlogSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),

  videoUrl: z.string().trim().url('Please provide a valid URL'),

  category: z.string().trim().optional(),

  status: StatusEnum.default('active'),
});

export const videoBlogUpdateSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').optional(),

  videoUrl: z.string().trim().url('Please provide a valid URL').optional(),

  category: z.string().trim().optional(),

  status: StatusEnum.optional(),
});

// ========== CATEGORY ==========

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),

  status: CategoryStatusEnum.default('active'),
});

export const categoryUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Category name cannot be empty').optional(),

  status: CategoryStatusEnum.optional(),
});

// ========== TYPES ==========
export type VideoBlogInput = z.infer<typeof videoBlogSchema>;
export type VideoBlogUpdateInput = z.infer<typeof videoBlogUpdateSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
