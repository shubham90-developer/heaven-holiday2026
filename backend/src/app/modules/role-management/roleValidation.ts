// src/modules/role/roleValidation.ts

import { z } from 'zod';

export const createRoleValidation = z.object({
  name: z.string().min(1, 'Role name is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission required'),
});

export const updateRoleValidation = z.object({
  permissions: z.array(z.string()).min(1, 'At least one permission required'),
});

export const createUserValidation = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleId: z.string().min(1, 'Role is required'),
});

export const changeRoleValidation = z.object({
  roleId: z.string().min(1, 'Role is required'),
});
