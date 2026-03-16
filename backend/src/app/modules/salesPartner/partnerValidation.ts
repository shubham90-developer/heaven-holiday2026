import { z } from 'zod';

export const createCardSchema = z.object({
  icon: z.string().url('Icon must be a valid URL').min(1, 'Icon is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  cities: z.array(z.string()).min(1, 'At least one city is required'),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updateCardSchema = z.object({
  icon: z
    .string()
    .url('Icon must be a valid URL')
    .min(1, 'Icon is required')
    .optional(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  cities: z
    .array(z.string())
    .min(1, 'At least one city is required')
    .optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const getCardSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const deleteCardSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// Validation for card limit (maximum 3 cards)
export const MAX_CARDS_LIMIT = 3;

export const validateCardLimit = async (
  currentCount: number,
): Promise<{ isValid: boolean; error?: string }> => {
  if (currentCount >= MAX_CARDS_LIMIT) {
    return {
      isValid: false,
      error: `Maximum limit of ${MAX_CARDS_LIMIT} cards reached. Please delete an existing card before creating a new one.`,
    };
  }
  return { isValid: true };
};
