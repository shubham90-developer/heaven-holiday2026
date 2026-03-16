import { z } from 'zod';

export const adminLoginValidation = z.object({
  email: z.string('Email is required').email('Invalid email format'),
  password: z
    .string('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const changePasswordValidation = z
  .object({
    currentPassword: z
      .string('Current password is required')
      .min(6, 'Password must be at least 6 characters'),
    newPassword: z
      .string('New password is required')
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string('Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const updateEmailValidation = z.object({
  newEmail: z
    .string('New email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  currentPassword: z
    .string('Current password is required')
    .min(6, 'Password must be at least 6 characters'),
});
