// counter.validation.ts
import { z } from 'zod';

export const counterValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  subTitle: z.string().min(1, 'Sub title is required'),
  guests: z.number().int().nonnegative('Guests must be a positive number'),
  toursCompleted: z
    .number()
    .int()
    .nonnegative('Tours completed must be a positive number'),
  tourExpert: z
    .number()
    .int()
    .nonnegative('Tour expert must be a positive number'),
  tourDestination: z
    .number()
    .int()
    .nonnegative('Tour destination must be a positive number'),
  bigTravelCompany: z.string().min(1, 'This field is required'),
});

export const updateCounterValidation = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  subTitle: z.string().min(1, 'Sub title is required').optional(),
  guests: z
    .number()
    .int()
    .nonnegative('Guests must be a positive number')
    .optional(),
  toursCompleted: z
    .number()
    .int()
    .nonnegative('Tours completed must be a positive number')
    .optional(),
  tourExpert: z
    .number()
    .int()
    .nonnegative('Tour expert must be a positive number')
    .optional(),
  tourDestination: z
    .number()
    .int()
    .nonnegative('Tour destination must be a positive number')
    .optional(),
  bigTravelCompany: z.string().min(1, 'This field is required').optional(),
});
