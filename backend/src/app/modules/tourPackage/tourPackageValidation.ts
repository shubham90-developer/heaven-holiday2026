import { z } from 'zod';

// ============= SUB-SCHEMA VALIDATIONS =============

// Itinerary Schema
const itinerarySchema = z.object({
  day: z
    .number()
    .int({ message: 'Day must be an integer' })
    .min(1, { message: 'Day must be at least 1' }),

  date: z.coerce.date().optional(),

  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),

  activity: z
    .string()
    .trim()
    .min(1, { message: 'Activity is required' })
    .max(1000, { message: 'Activity must be less than 1000 characters' }),
});

// State Schema
// State Schema
const stateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'State name is required' })
    .max(100, { message: 'State name must be less than 100 characters' }),

  cities: z
    .array(z.string().trim().min(1, { message: 'City name cannot be empty' }))
    .min(1, { message: 'At least one city is required' }),

  // ⭐ ADD THESE TWO FIELDS
  region: z
    .enum(
      [
        'North India',
        'South India',
        'East & North East India',
        'Rajasthan, West & Central India',
      ],
      {
        message: 'Invalid region',
      },
    )
    .optional(),

  continent: z
    .enum(
      ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'],
      {
        message: 'Invalid continent',
      },
    )
    .optional(),
});

// City Details Schema
const cityDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'City name is required' })
    .max(100, { message: 'City name must be less than 100 characters' }),

  nights: z.number().int().min(0, { message: 'Nights must be 0 or more' }),
});

// ============= NEW: FLIGHT SCHEMA =============
const flightSchema = z
  .object({
    flightNumber: z
      .string()
      .trim()
      .max(20, { message: 'Flight number must be less than 20 characters' })
      .optional(),

    fromCity: z
      .string()
      .trim()
      .min(1, { message: 'From city is required' })
      .max(100, { message: 'From city must be less than 100 characters' }),

    toCity: z
      .string()
      .trim()
      .min(1, { message: 'To city is required' })
      .max(100, { message: 'To city must be less than 100 characters' }),

    departureDate: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
      message: 'Invalid departure date format',
    }),

    departureTime: z
      .string()
      .trim()
      .min(1, { message: 'Departure time is required' })
      .max(20, { message: 'Departure time must be less than 20 characters' }),

    arrivalDate: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
      message: 'Invalid arrival date format',
    }),

    arrivalTime: z
      .string()
      .trim()
      .min(1, { message: 'Arrival time is required' })
      .max(20, { message: 'Arrival time must be less than 20 characters' }),

    airline: z
      .string()
      .trim()
      .min(1, { message: 'Airline is required' })
      .max(100, { message: 'Airline must be less than 100 characters' }),

    duration: z
      .string()
      .trim()
      .max(20, { message: 'Duration must be less than 20 characters' })
      .optional(),
  })
  .refine((data) => data.arrivalDate >= data.departureDate, {
    message: 'Arrival date must be after or equal to departure date',
    path: ['arrivalDate'],
  });

// ============= NEW: ACCOMMODATION SCHEMA =============
const accommodationSchema = z
  .object({
    city: z
      .string()
      .trim()
      .min(1, { message: 'City is required' })
      .max(100, { message: 'City must be less than 100 characters' }),

    country: z
      .string()
      .trim()
      .min(1, { message: 'Country is required' })
      .max(100, { message: 'Country must be less than 100 characters' }),

    hotelName: z
      .string()
      .trim()
      .min(1, { message: 'Hotel name is required' })
      .max(200, { message: 'Hotel name must be less than 200 characters' }),

    checkInDate: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
      message: 'Invalid check-in date format',
    }),

    checkOutDate: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
      message: 'Invalid check-out date format',
    }),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  });

// ============= NEW: REPORTING & DROPPING SCHEMA =============
const reportingDroppingSchema = z.object({
  guestType: z
    .string()
    .trim()
    .min(1, { message: 'Guest type is required' })
    .max(100, { message: 'Guest type must be less than 100 characters' }),

  reportingPoint: z
    .string()
    .trim()
    .min(1, { message: 'Reporting point is required' })
    .max(200, { message: 'Reporting point must be less than 200 characters' }),

  droppingPoint: z
    .string()
    .trim()
    .min(1, { message: 'Dropping point is required' })
    .max(200, { message: 'Dropping point must be less than 200 characters' }),
});

// ============= DEPARTURE SCHEMA =============
const departureSchema = z
  .object({
    city: z
      .string()
      .trim()
      .min(1, { message: 'Departure city is required' })
      .max(100, { message: 'Departure city must be less than 100 characters' }),

    date: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
      message: 'Invalid date format',
    }),

    fullPackagePrice: z
      .number()
      .min(0, { message: 'Full package price must be positive' })
      .finite({ message: 'Price must be a valid number' }),

    joiningPrice: z
      .number()
      .min(0, { message: 'Joining price must be positive' })
      .finite({ message: 'Price must be a valid number' }),

    availableSeats: z
      .number()
      .int({ message: 'Available seats must be an integer' })
      .min(0, { message: 'Available seats cannot be negative' }),

    totalSeats: z
      .number()
      .int({ message: 'Total seats must be an integer' })
      .min(1, { message: 'Total seats must be at least 1' }),

    status: z
      .enum(['Available', 'Filling Fast', 'Sold Out', 'Cancelled'], {
        message:
          'Status must be one of: Available, Filling Fast, Sold Out, Cancelled',
      })
      .optional()
      .default('Available'),
  })
  .refine((data) => data.availableSeats <= data.totalSeats, {
    message: 'Available seats cannot exceed total seats',
    path: ['availableSeats'],
  })
  .refine((data) => data.joiningPrice <= data.fullPackagePrice, {
    message: 'Joining price cannot exceed full package price',
    path: ['joiningPrice'],
  });

// FIND this existing priceBreakdownSchema and REPLACE entirely

const priceBreakdownSchema = z.object({
  adultSingleSharing: z.coerce
    .number()
    .min(0, { message: 'Price cannot be negative' }),

  adultDoubleSharing: z.coerce
    .number()
    .min(0, { message: 'Price cannot be negative' }),

  adultTripleSharing: z.coerce
    .number()
    .min(0, { message: 'Price cannot be negative' }),

  childWithBed: z.coerce
    .number()
    .min(0, { message: 'Price cannot be negative' }),

  childWithoutBed: z.coerce
    .number()
    .min(0, { message: 'Price cannot be negative' }),

  infantBasePrice: z.coerce
    .number()
    .min(0, { message: 'Price cannot be negative' }),

  infantWithRoom: z.coerce
    .number()
    .min(0, { message: 'Price cannot be negative' }),
});

// ============= CATEGORY SCHEMAS =============

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),

  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),

  description: z.string().trim().optional(),

  guests: z
    .string()
    .trim()
    .min(1, { message: 'Guests count is required' })
    .max(50, { message: 'Guests must be less than 50 characters' }),

  image: z.string().min(1, { message: 'Image is required' }),

  icon: z.string().trim().optional(),

  badge: z
    .string()
    .trim()
    .max(50, { message: 'Badge text must be less than 50 characters' })
    .optional(),

  categoryType: z.enum(['world', 'india'], {
    message: 'Category type must be either "world" or "india"',
  }),

  status: z.enum(['Active', 'Inactive']).optional().default('Active'),
});

// Category CRUD Schemas
export const createCategorySchema = categorySchema;

export const updateCategorySchema = categorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// ============= TOUR PACKAGE CARD SCHEMAS =============

export const tourPackageCardSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: 'Title is required' })
      .max(200, { message: 'Title must be less than 200 characters' }),

    subtitle: z
      .string()
      .trim()
      .min(1, { message: 'Subtitle is required' })
      .max(300, { message: 'Subtitle must be less than 300 characters' }),

    category: z.string().min(1, { message: 'Category is required' }),

    galleryImages: z.array(z.string()).optional(),

    badge: z
      .string()
      .trim()
      .max(100, { message: 'Badge text must be less than 100 characters' })
      .optional(),

    metaDescription: z.string().trim().optional(),

    featured: z.boolean().optional().default(false),

    status: z.enum(['Active', 'Inactive']).optional().default('Active'),

    tourType: z
      .string()
      .trim()
      .min(1, { message: 'Tour type is required' })
      .max(50, { message: 'Tour type must be less than 50 characters' }),

    rating: z
      .number()
      .min(0, { message: 'Rating must be at least 0' })
      .max(5, { message: 'Rating cannot exceed 5' })
      .optional()
      .default(0),

    reviewCount: z
      .number()
      .int()
      .min(0, { message: 'Review count cannot be negative' })
      .optional()
      .default(0),

    days: z.number().int().min(1, { message: 'Days must be at least 1' }),

    nights: z.number().int().min(0, { message: 'Nights must be 0 or more' }),

    states: z
      .array(stateSchema)
      .min(1, { message: 'At least one state is required' }),

    route: z
      .string()
      .trim()
      .min(1, { message: 'Route is required' })
      .max(500, { message: 'Route must be less than 500 characters' }),

    cityDetails: z
      .array(cityDetailsSchema)
      .min(1, { message: 'At least one city detail is required' }),

    // Base prices
    baseFullPackagePrice: z
      .number()
      .min(0, { message: 'Base full package price must be positive' }),

    baseJoiningPrice: z
      .number()
      .min(0, { message: 'Base joining price must be positive' }),

    priceNote: z.string().trim().optional(),
    priceBreakdown: priceBreakdownSchema,
    tscCharge: z
      .number()
      .min(0, { message: 'TSC charge cannot be negative' })
      .optional()
      .default(0),
    emiPerMonth: z.number().min(0).optional(),

    // Departures array
    departures: z
      .array(departureSchema)
      .min(1, { message: 'At least one departure is required' })
      .refine(
        (departures) => {
          // Check for duplicate city-date combinations
          const combinations = new Set<string>();
          for (const dep of departures) {
            const key = `${dep.city}-${dep.date.toISOString()}`;
            if (combinations.has(key)) {
              return false;
            }
            combinations.add(key);
          }
          return true;
        },
        {
          message: 'Duplicate departure city-date combinations are not allowed',
        },
      ),

    tourManagerIncluded: z.boolean().optional().default(false),

    tourManagerNote: z.string().trim().optional(),

    whyTravel: z.array(z.string().trim()).optional().default([]),

    tourIncludes: z
      .array(
        z
          .string()
          .min(24, { message: 'Invalid tour include ID' })
          .max(24, { message: 'Invalid tour include ID' }),
      )
      .optional()
      .default([]),

    // Itinerary
    itinerary: z
      .array(itinerarySchema)
      .min(1, { message: 'At least one itinerary item is required' })
      .refine(
        (items) => {
          // Validate unique days
          const days = items.map((item) => item.day);
          return days.length === new Set(days).size;
        },
        { message: 'Duplicate day numbers are not allowed' },
      ),

    flights: z.array(flightSchema).optional().default([]),

    accommodations: z.array(accommodationSchema).optional().default([]),

    reportingDropping: z.array(reportingDroppingSchema).optional().default([]),
    tourInclusions: z.string().trim().optional(),
    tourExclusions: z.string().trim().optional(),
    tourPrepartion: z.string().trim().optional(),
    needToKnow: z.string().trim().optional(),
    cancellationPolicy: z.string().trim().optional(),
  })
  .refine((data) => data.baseJoiningPrice <= data.baseFullPackagePrice, {
    message: 'Base joining price cannot exceed base full package price',
    path: ['baseJoiningPrice'],
  });

// Tour Package Card CRUD Schemas
export const createTourPackageCardSchema = tourPackageCardSchema;

export const updateTourPackageCardSchema = tourPackageCardSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// ============= QUERY SCHEMAS =============

// Schema for filtering categories
export const getCategoryQuerySchema = z.object({
  categoryType: z.enum(['world', 'india']).optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
  name: z.string().trim().optional(),
});

// Schema for filtering tour package cards with departure filters
export const getTourPackageCardQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
  featured: z.boolean().optional(),
  tourType: z.string().trim().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minRating: z
    .number()
    .min(0, { message: 'Minimum rating must be at least 0' })
    .max(5, { message: 'Minimum rating cannot exceed 5' })
    .optional(),

  // Departure-related filters
  departureCity: z.string().trim().optional(),
  departureDateFrom: z.coerce.date().optional(),
  departureDateTo: z.coerce.date().optional(),
  departureStatus: z
    .enum(['Available', 'Filling Fast', 'Sold Out', 'Cancelled'])
    .optional(),
  minSeats: z
    .number()
    .int()
    .min(0, { message: 'Minimum seats cannot be negative' })
    .optional(),
});

// Schema for pagination
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, { message: 'Page must be at least 1' })
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, { message: 'Limit must be at least 1' })
    .max(100, { message: 'Limit cannot exceed 100' })
    .optional()
    .default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ============= MONGODB ID VALIDATION =============

export const mongoIdSchema = z
  .string()
  .refine((val) => /^[a-f\d]{24}$/i.test(val), {
    message: 'Invalid MongoDB ObjectId',
  });

// ============= BULK OPERATIONS =============

export const bulkDeleteSchema = z.object({
  ids: z
    .array(mongoIdSchema)
    .min(1, { message: 'At least one ID is required' }),
});

export const bulkUpdateStatusSchema = z.object({
  ids: z
    .array(mongoIdSchema)
    .min(1, { message: 'At least one ID is required' }),
  status: z.enum(['Active', 'Inactive']),
});

// ============= TYPE EXPORTS =============

// Category Types
export type CategoryInput = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type GetCategoryQueryInput = z.infer<typeof getCategoryQuerySchema>;

// Tour Package Card Types
export type TourPackageCardInput = z.infer<typeof tourPackageCardSchema>;
export type CreateTourPackageCardInput = z.infer<
  typeof createTourPackageCardSchema
>;
export type UpdateTourPackageCardInput = z.infer<
  typeof updateTourPackageCardSchema
>;
export type GetTourPackageCardQueryInput = z.infer<
  typeof getTourPackageCardQuerySchema
>;

// Departure Types
export type DepartureInput = z.infer<typeof departureSchema>;

//  NEW: Flight, Accommodation, Reporting Types
export type FlightInput = z.infer<typeof flightSchema>;
export type AccommodationInput = z.infer<typeof accommodationSchema>;
export type ReportingDroppingInput = z.infer<typeof reportingDroppingSchema>;

// Sub-schema Types
export type StateInput = z.infer<typeof stateSchema>;
export type CityDetailsInput = z.infer<typeof cityDetailsSchema>;
export type ItineraryInput = z.infer<typeof itinerarySchema>;

// Utility Types
export type PaginationInput = z.infer<typeof paginationSchema>;
export type MongoIdInput = z.infer<typeof mongoIdSchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;
