// validations/contactfeatures.validation.ts
import { z } from 'zod';

// Validation for creating contact features document
const createContactFeaturesBodySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Highlight message is required')
    .max(300, 'Message cannot exceed 300 characters'),
  happyTravellers: z
    .string()
    .trim()
    .min(1, 'Happy travellers count is required'),
  successfulTours: z
    .string()
    .trim()
    .min(1, 'Successful tours count is required'),
});

export const createContactFeaturesSchema = z.object({
  body: createContactFeaturesBodySchema,
});

// Validation for creating a feature
const createFeatureBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Feature title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Feature description is required')
    .max(300, 'Description cannot exceed 300 characters'),
  isActive: z.boolean().optional(),
});

export const createFeatureSchema = z.object({
  body: createFeatureBodySchema,
});

// Validation for updating a feature
const updateFeatureBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Feature title is required')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Feature description is required')
    .max(300, 'Description cannot exceed 300 characters')
    .optional(),
  isActive: z.boolean().optional(),
});

export const updateFeatureSchema = z.object({
  params: z.object({
    featureId: z.string().min(1, 'Feature ID is required'),
  }),
  body: updateFeatureBodySchema,
});

// Validation for deleting a feature
export const deleteFeatureSchema = z.object({
  params: z.object({
    featureId: z.string().min(1, 'Feature ID is required'),
  }),
});

// Validation for updating highlight section
const updateHighlightBodySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Highlight message is required')
    .max(300, 'Message cannot exceed 300 characters')
    .optional(),
  happyTravellers: z
    .string()
    .trim()
    .min(1, 'Happy travellers count is required')
    .optional(),
  successfulTours: z
    .string()
    .trim()
    .min(1, 'Successful tours count is required')
    .optional(),
});

export const updateHighlightSchema = z.object({
  body: updateHighlightBodySchema,
});

// Type exports
export type CreateContactFeaturesBody = z.infer<
  typeof createContactFeaturesBodySchema
>;
export type CreateFeatureBody = z.infer<typeof createFeatureBodySchema>;
export type UpdateFeatureParams = z.infer<typeof updateFeatureSchema>['params'];
export type UpdateFeatureBody = z.infer<typeof updateFeatureBodySchema>;
export type DeleteFeatureParams = z.infer<typeof deleteFeatureSchema>['params'];
export type UpdateHighlightBody = z.infer<typeof updateHighlightBodySchema>;
