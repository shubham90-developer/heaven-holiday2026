// validations/faq.validation.ts
import { z } from 'zod';

// Validation for creating a new category
export const createCategorySchema = z.object({
  body: z.object({
    category: z
      .string()
      .trim()
      .min(1, 'Category is required')
      .max(100, 'Category cannot exceed 100 characters'),
    isActive: z.boolean().optional(),
  }),
});

// Validation for creating a new FAQ
export const createFAQSchema = z.object({
  body: z.object({
    category: z.string().trim().min(1, 'Category is required'),
    question: z
      .string()
      .trim()
      .min(1, 'Question is required')
      .max(500, 'Question cannot exceed 500 characters'),
    answer: z
      .string()
      .trim()
      .min(1, 'Answer is required')
      .max(2000, 'Answer cannot exceed 2000 characters'),
    isActive: z.boolean().optional(),
  }),
});

// Validation for updating a category
export const updateCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().min(1, 'Category ID is required'),
  }),
  body: z.object({
    category: z
      .string()
      .trim()
      .min(1, 'Category is required')
      .max(100, 'Category cannot exceed 100 characters')
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

// Validation for updating a FAQ
export const updateFAQSchema = z.object({
  params: z.object({
    faqId: z.string().min(1, 'FAQ ID is required'),
  }),
  body: z.object({
    category: z.string().trim().min(1, 'Category is required').optional(),
    question: z
      .string()
      .trim()
      .min(1, 'Question is required')
      .max(500, 'Question cannot exceed 500 characters')
      .optional(),
    answer: z
      .string()
      .trim()
      .min(1, 'Answer is required')
      .max(2000, 'Answer cannot exceed 2000 characters')
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

// Validation for deleting a specific category (by categoryId)
export const deleteCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().min(1, 'Category ID is required'),
  }),
});

// Validation for deleting a specific FAQ (by faqId)
export const deleteFAQSchema = z.object({
  params: z.object({
    faqId: z.string().min(1, 'FAQ ID is required'),
  }),
});

// Type exports
export type CreateCategoryBody = z.infer<typeof createCategorySchema>['body'];
export type CreateFAQBody = z.infer<typeof createFAQSchema>['body'];
export type UpdateCategoryParams = z.infer<
  typeof updateCategorySchema
>['params'];
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>['body'];
export type UpdateFAQParams = z.infer<typeof updateFAQSchema>['params'];
export type UpdateFAQBody = z.infer<typeof updateFAQSchema>['body'];
export type DeleteCategoryParams = z.infer<
  typeof deleteCategorySchema
>['params'];
export type DeleteFAQParams = z.infer<typeof deleteFAQSchema>['params'];
