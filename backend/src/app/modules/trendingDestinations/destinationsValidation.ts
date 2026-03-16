import { z } from 'zod';

export const destinationSchema = z.object({
  _id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, 'Destination title is required')
    .max(200, 'Destination title must be less than 200 characters'),
  image: z.string().min(1, 'Destination image is required'),
  tours: z
    .number()
    .int('Tours must be an integer')
    .min(0, 'Tours cannot be negative')
    .default(0),
  departures: z
    .number()
    .int('Departures must be an integer')
    .min(0, 'Departures cannot be negative')
    .default(0),
  guests: z
    .number()
    .int('Guests must be an integer')
    .min(0, 'Guests cannot be negative')
    .default(0),
  category: z.enum(['World', 'India']),
  status: z.enum(['active', 'inactive']).default('active'),
  order: z.number().int('Order must be an integer').default(0),
});

export const createDestinationSchema = destinationSchema.omit({ _id: true });

export const updateDestinationSchema = destinationSchema
  .partial()
  .omit({ _id: true });

export const updateTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters'),
});

export const addDestinationSchema = createDestinationSchema;

export const updateDestinationBodySchema = updateDestinationSchema;

export type Destination = z.infer<typeof destinationSchema>;
export type CreateDestination = z.infer<typeof createDestinationSchema>;
export type UpdateDestination = z.infer<typeof updateDestinationSchema>;
export type UpdateTitle = z.infer<typeof updateTitleSchema>;
