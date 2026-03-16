import { z } from 'zod';

// ========== TRAVELER VALIDATION ==========
const travelerSchema = z.object({
  type: z.enum(['Adult', 'Child', 'Infant'], {
    message: 'Traveler type must be Adult, Child, or Infant',
  }),

  title: z.enum(['Mr', 'Mrs', 'Ms', 'Master', 'Miss'], {
    message: 'Invalid title',
  }),

  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name cannot exceed 50 characters' })
    .trim(),

  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name cannot exceed 50 characters' })
    .trim(),

  dateOfBirth: z.coerce.date().refine((date) => date < new Date(), {
    message: 'Date of birth must be in the past',
  }),

  age: z.coerce
    .number()
    .int({ message: 'Age must be a whole number' })
    .min(0, { message: 'Age cannot be negative' })
    .max(120, { message: 'Age cannot exceed 120' }),

  gender: z.enum(['Male', 'Female', 'Other'], {
    message: 'Gender must be Male or Female',
  }),

  isLeadTraveler: z.boolean().optional(),

  email: z
    .union([z.string().email('Invalid email format'), z.literal('')])
    .optional(),

  phone: z.string().optional(),
  passportImage: z.string().optional(),
  passportNo: z.string().optional(),

  passportExpiryDate: z.coerce
    .date()
    .refine(
      (date) => {
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        return date >= sixMonthsFromNow;
      },
      { message: 'Passport must be valid for at least 6 months from today' },
    )
    .optional(),
});

// ========== SELECTED DEPARTURE ==========
const selectedDepartureSchema = z.object({
  departureId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  departureCity: z.string().min(2).trim(),
  departureDate: z.coerce.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message: 'Departure date must be today or future' },
  ),
  packageType: z.enum(['Full Package', 'Joining Package']),
  roomConfiguration: z
    .array(
      z.object({
        roomType: z.enum(['Single', 'Double', 'Triple']),
        count: z.number().int().min(1),
      }),
    )
    .min(1, { message: 'At least one room required' }),
  childOption: z.enum(['WithBed', 'WithoutBed']).optional(),
  infantOption: z.enum(['Base', 'WithRoom']).optional(),
});

// ========== TRAVELER COUNT ==========
const travelerCountSchema = z.object({
  adults: z.coerce
    .number()
    .int({ message: 'Adults count must be a whole number' })
    .min(1, { message: 'At least 1 adult is required' }),

  children: z.coerce
    .number()
    .int({ message: 'Children count must be a whole number' })
    .min(0, { message: 'Children count cannot be negative' })
    .default(0),

  infants: z.coerce
    .number()
    .int({ message: 'Infants count must be a whole number' })
    .min(0, { message: 'Infants count cannot be negative' })
    .default(0),

  total: z.coerce
    .number()
    .int({ message: 'Total count must be a whole number' })
    .min(1, { message: 'Total travelers must be at least 1' }),
});

// ========== PRICING ==========
const pricingSchema = z.object({
  totalAmount: z.coerce
    .number()
    .min(0, { message: 'Total amount cannot be negative' })
    .finite({ message: 'Total amount must be a valid number' }),

  advanceAmount: z.coerce
    .number()
    .min(0, { message: 'Advance amount cannot be negative' })
    .finite({ message: 'Advance amount must be a valid number' }),

  paidAmount: z.coerce
    .number()
    .min(0, { message: 'Paid amount cannot be negative' })
    .default(0)
    .optional(),

  pendingAmount: z.coerce
    .number()
    .min(0, { message: 'Pending amount cannot be negative' })
    .default(0)
    .optional(),

  adultCost: z.coerce.number().min(0).optional(),
  childCost: z.coerce.number().min(0).optional(),
  infantCost: z.coerce.number().min(0).optional(),
  baseAmount: z.coerce.number().min(0).optional(),
  gstPercentage: z.coerce.number().min(0).default(5),
  gstAmount: z.coerce.number().min(0).optional(),
});

// ========== PAYMENT ==========
const paymentSchema = z.object({
  paymentId: z.string().min(5),
  amount: z.coerce.number().min(1),
  paymentMethod: z.enum(['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet']),
  paymentStatus: z.enum(['Pending', 'Success', 'Failed']).default('Pending'),
  paymentDate: z.coerce.date().default(() => new Date()),
  transactionId: z.string().optional(),
  remarks: z.string().max(500).optional(),

  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

// ========== CREATE BOOKING ==========
export const createBookingSchema = z
  .object({
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    tourPackage: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid tour package ID format'),
    selectedDeparture: selectedDepartureSchema,
    travelers: z
      .array(travelerSchema)
      .min(1, { message: 'At least one traveler is required' })
      .max(20, { message: 'Cannot book for more than 20 travelers' }),
    travelerCount: travelerCountSchema,
    pricing: pricingSchema,
  })

  .refine(
    (data) => {
      const adults = data.travelers.filter((t) => t.type === 'Adult').length;
      const children = data.travelers.filter((t) => t.type === 'Child').length;
      const infants = data.travelers.filter((t) => t.type === 'Infant').length;
      return (
        adults === data.travelerCount.adults &&
        children === data.travelerCount.children &&
        infants === data.travelerCount.infants
      );
    },
    {
      message: 'Traveler count does not match travelers array',
      path: ['travelers'],
    },
  )

  .refine(
    (data) => {
      const sum =
        data.travelerCount.adults +
        data.travelerCount.children +
        data.travelerCount.infants;
      return data.travelerCount.total === sum;
    },
    {
      message: 'Total must equal adults + children + infants',
      path: ['travelerCount', 'total'],
    },
  )

  .refine((data) => data.travelers.some((t) => t.isLeadTraveler), {
    message: 'At least one lead traveler required',
    path: ['travelers'],
  })

  .refine(
    (data) => data.travelers.filter((t) => t.isLeadTraveler).length === 1,
    {
      message: 'Only one lead traveler allowed',
      path: ['travelers'],
    },
  )
  // 1. Room capacity must equal adult count
  .refine(
    (data) => {
      const capacity = { Single: 1, Double: 2, Triple: 3 };
      const total = data.selectedDeparture.roomConfiguration.reduce(
        (sum, room) => sum + capacity[room.roomType] * room.count,
        0,
      );
      return total === data.travelerCount.adults;
    },
    {
      message: 'Room capacity must equal adult count',
      path: ['selectedDeparture', 'roomConfiguration'],
    },
  )

  // 2. childOption required if children > 0
  .refine(
    (data) => {
      if (data.travelerCount.children > 0) {
        return !!data.selectedDeparture.childOption;
      }
      return true;
    },
    {
      message: 'childOption is required when children > 0',
      path: ['selectedDeparture', 'childOption'],
    },
  )

  // 3. infantOption required if infants > 0
  .refine(
    (data) => {
      if (data.travelerCount.infants > 0) {
        return !!data.selectedDeparture.infantOption;
      }
      return true;
    },
    {
      message: 'infantOption is required when infants > 0',
      path: ['selectedDeparture', 'infantOption'],
    },
  )

  .refine((data) => data.pricing.advanceAmount <= data.pricing.totalAmount, {
    message: 'Advance amount cannot exceed total amount',
    path: ['pricing', 'advanceAmount'],
  });

// ========== CANCEL BOOKING SCHEMA (IMPROVED) ==========

// ========== UPDATE BOOKING TRAVELERS SCHEMA ==========
export const updateBookingTravelersSchema = z
  .object({
    travelers: z
      .array(
        z.object({
          type: z.enum(['Adult', 'Child', 'Infant'], {
            message: 'Traveler type must be Adult, Child, or Infant',
          }),

          title: z.enum(['Mr', 'Mrs', 'Ms', 'Master', 'Miss'], {
            message: 'Invalid title',
          }),

          firstName: z
            .string()
            .min(2, { message: 'First name must be at least 2 characters' })
            .max(50, { message: 'First name cannot exceed 50 characters' })
            .trim(),

          lastName: z
            .string()
            .min(2, { message: 'Last name must be at least 2 characters' })
            .max(50, { message: 'Last name cannot exceed 50 characters' })
            .trim(),

          dateOfBirth: z.coerce.date().refine((date) => date < new Date(), {
            message: 'Date of birth must be in the past',
          }),

          age: z.coerce
            .number()
            .int({ message: 'Age must be a whole number' })
            .min(0, { message: 'Age cannot be negative' })
            .max(120, { message: 'Age cannot exceed 120' }),

          gender: z.enum(['Male', 'Female', 'Other'], {
            message: 'Gender must be Male or Female',
          }),

          isLeadTraveler: z.boolean().default(false),

          email: z
            .union([z.string().email('Invalid email format'), z.literal('')])
            .optional(),

          phone: z.string().optional(),
          passportImage: z.string().optional(),
          passportNo: z.string().optional(),
          passportExpiryDate: z.coerce
            .date()
            .refine(
              (date) => {
                const sixMonthsFromNow = new Date();
                sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
                return date >= sixMonthsFromNow;
              },
              {
                message:
                  'Passport must be valid for at least 6 months from today',
              },
            )
            .optional(),
        }),
      )
      .min(1, { message: 'At least one traveler is required' })
      .max(20, { message: 'Cannot update more than 20 travelers' }),

    // Room configuration update
    selectedDeparture: z
      .object({
        roomConfiguration: z
          .array(
            z.object({
              roomType: z.enum(['Single', 'Double', 'Triple']),
              count: z.number().int().min(0),
            }),
          )
          .optional(),
        childOption: z.enum(['WithBed', 'WithoutBed']).optional(),
        infantOption: z.enum(['Base', 'WithRoom']).optional(),
      })
      .optional(),
  })
  // Ensure exactly one lead traveler
  .refine((data) => data.travelers.some((t) => t.isLeadTraveler), {
    message: 'At least one lead traveler is required',
    path: ['travelers'],
  })
  .refine(
    (data) => data.travelers.filter((t) => t.isLeadTraveler).length === 1,
    {
      message: 'Only one lead traveler is allowed',
      path: ['travelers'],
    },
  );

// ========== OTHER SCHEMAS ==========
export const updateBookingStatusSchema = z.object({
  bookingStatus: z.enum(['Pending', 'Confirmed', 'Completed', 'Cancelled']),
});

export const addPaymentSchema = paymentSchema;

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['Pending', 'Advance Paid', 'Fully Paid']),
});

export const getBookingsQuerySchema = z.object({
  user: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  tourPackage: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  bookingStatus: z
    .enum(['Pending', 'Confirmed', 'Completed', 'Cancelled'])
    .optional(),
  paymentStatus: z.enum(['Pending', 'Advance Paid', 'Fully Paid']).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
// ========== UPDATE REFUND STATUS SCHEMA ==========
export const updateRefundStatusSchema = z.object({
  status: z.enum(['Approved', 'Rejected', 'Completed'], {
    message: 'Status must be Approved, Rejected, or Completed',
  }),
  remarks: z.string().optional(),
  transactionId: z.string().optional(),
});

// ========== UPLOAD BOOKING DOCUMENT SCHEMA ==========
export const uploadBookingDocumentSchema = z
  .object({
    bookingId: z.string().min(1, { message: 'Booking ID is required' }),
    documentType: z.enum(['ticket', 'gatepass', 'other'], {
      message: 'Document type must be ticket, gatepass, or other',
    }),
    travelerIndex: z.coerce
      .number()
      .int()
      .min(0, { message: 'Traveler index must be 0 or greater' }),
    label: z.string().max(100).optional(),
  })
  .refine(
    (data) => {
      if (data.documentType === 'other' && !data.label) return false;
      return true;
    },
    {
      message: 'Label is required when document type is other',
      path: ['label'],
    },
  );
// ========== TYPES ==========
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;
export type AddPaymentInput = z.infer<typeof addPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<
  typeof updatePaymentStatusSchema
>;
export type GetBookingsQueryInput = z.infer<typeof getBookingsQuerySchema>;

export type UpdateBookingTravelersInput = z.infer<
  typeof updateBookingTravelersSchema
>;
export type UploadBookingDocumentInput = z.infer<
  typeof uploadBookingDocumentSchema
>;
