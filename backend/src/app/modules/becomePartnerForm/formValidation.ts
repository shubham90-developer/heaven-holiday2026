import { z } from 'zod';

export const createFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  state: z.string().min(1, 'State is required'),
  message: z.string().optional(),
  cardTitle: z.string().min(1, 'Card title is required'),
});

export const updateFormStatusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'completed', 'rejected'], {
    message: 'Status must be one of: pending, in-progress, completed, rejected',
  }),
});

export const getFormSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const deleteFormSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});
