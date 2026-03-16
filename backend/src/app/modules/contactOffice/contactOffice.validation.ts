import { z } from 'zod';

const officeTimeSchema = z
  .object({
    day: z.enum([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]),
    isOpen: z.boolean(),
    openTime: z
      .string()
      .regex(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        'Open time must be in HH:mm format (e.g., 09:00)',
      )
      .optional()
      .or(z.literal('')),
    closeTime: z
      .string()
      .regex(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        'Close time must be in HH:mm format (e.g., 18:00)',
      )
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.isOpen) {
        return !!data.openTime && !!data.closeTime;
      }
      return true;
    },
    {
      message: 'Open time and close time are required when office is open',
    },
  );

const holidaySchema = z.object({
  date: z.coerce.date(),
  description: z.string().min(1, 'Holiday description is required').trim(),
});

export const officeSchema = z.object({
  city: z.string().min(1, 'City is required').trim(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  forex: z.boolean().optional().default(false),
  address: z.string().min(1, 'Address is required').trim(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number is too long')
    .regex(
      /^\+?\d+$/,
      'Phone number must contain only digits, optionally starting with +',
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .trim()
    .toLowerCase(),
  mapUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  officeTimes: z
    .array(officeTimeSchema)
    .length(7, 'Office times must include all 7 days of the week')
    .refine(
      (times) => {
        const days = times.map((t) => t.day);
        const uniqueDays = new Set(days);
        return uniqueDays.size === 7;
      },
      {
        message: 'Each day of the week must be specified exactly once',
      },
    ),
  holidays: z.array(holidaySchema).optional().default([]),
});

export const createOfficeSchema = officeSchema;

export const updateOfficeSchema = officeSchema.partial().refine(
  (data) => {
    if (data.officeTimes) {
      return data.officeTimes.length === 7;
    }
    return true;
  },
  {
    message: 'If updating office times, all 7 days must be provided',
  },
);

export type CreateOfficeInput = z.infer<typeof createOfficeSchema>;
export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>;
