// validation.ts
import { z } from 'zod';

// Schema for adding/updating a SINGLE card (used with file upload routes)
export const addCardSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Active', 'Inactive']).optional(),
});

// Schema for card object in database
const cardSchema = z.object({
  img: z.string().min(1, 'Image path is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

// Schema for full purpose policy document
export const purposePolicySchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  cards: z.array(cardSchema).min(1, 'At least one card is required'),
});

export const createPurposePolicySchema = purposePolicySchema;
export const updatePurposePolicySchema = purposePolicySchema.partial();

// Types
export type AddCardInput = z.infer<typeof addCardSchema>;
export type PurposePolicyInput = z.infer<typeof purposePolicySchema>;
export type CreatePurposePolicyInput = z.infer<
  typeof createPurposePolicySchema
>;
export type UpdatePurposePolicyInput = z.infer<
  typeof updatePurposePolicySchema
>;
