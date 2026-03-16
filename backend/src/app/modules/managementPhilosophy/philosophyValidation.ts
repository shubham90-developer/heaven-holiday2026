import { z } from 'zod';

// Base card schema (reusable)
const baseCardSchema = {
  name: z.string().min(1, 'Name is required'),
  image: z.string().min(1, 'Image is required'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
};

// Validation for individual card
export const managementCardSchema = z.object(baseCardSchema);

// Validation for entire management document
export const managementSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  paragraph: z.string().min(1, 'Paragraph is required'),
  cards: z.array(managementCardSchema).default([]),
});

// Validation for adding a single card (same as base)
export const addCardSchema = managementCardSchema;

// Validation for updating a card (image optional, id required)
export const updateCardSchema = z.object({
  id: z.string().min(1, 'Card ID is required'),
  ...baseCardSchema,
  image: z.string().optional(),
});

// Export types
export type ManagementCard = z.infer<typeof managementCardSchema>;
export type Management = z.infer<typeof managementSchema>;
export type AddCard = z.infer<typeof addCardSchema>;
export type UpdateCard = z.infer<typeof updateCardSchema>;
