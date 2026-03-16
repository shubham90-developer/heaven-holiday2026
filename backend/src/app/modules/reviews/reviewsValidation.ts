import { z } from 'zod';

const reviewSchema = z.object({
  rating: z
    .number()
    .min(0, 'Rating cannot be less than 0')
    .max(5, 'Rating cannot be more than 5')
    .optional(),
  tag: z.string().min(1, 'Tag is required'),
  title: z.string().min(1, 'Title is required'),
  text: z.string().min(1, 'Review text is required'),
  author: z.string().min(1, 'Author is required'),
  guides: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export const tourReviewSchema = z.object({
  mainTitle: z.string().min(1, 'Main title is required'),
  mainSubtitle: z.string().min(1, 'Main subtitle is required'),
  reviews: z.array(reviewSchema).min(1, 'At least one review is required'),
  isActive: z.boolean().optional(),
});
