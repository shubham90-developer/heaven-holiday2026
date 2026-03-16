import { z } from 'zod';

const colorOptions = [
  'from-gray-700 to-yellow-800',
  'from-pink-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-green-500 to-teal-600',
  'from-red-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-yellow-600',
  'from-indigo-500 to-blue-600',
  'from-purple-500 to-pink-600',
] as const;

export const principleDetailValidation = z.object({
  subtitle: z.string().min(1, 'Subtitle is required'),
  principleDescription: z.string().min(1, 'Principle description is required'),
  color: z.enum(colorOptions),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const principleValidation = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  details: z
    .array(principleDetailValidation)
    .min(1, 'At least one detail is required'),
});

export const updatePrincipleValidation = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  details: z.array(principleDetailValidation.partial()).optional(),
});
