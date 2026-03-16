// settings.validation.ts

import { z } from 'zod';

export const settingsUpdateValidation = z.object({
  // Brand Identity
  companyName: z.string().trim().min(1).optional(),
  companyLogo: z.string().optional(),
  paymentGateways: z.string().optional(),
  favicon: z.string().optional(),
  copyrightText: z.string().trim().optional(),

  // Phone Numbers
  tollFree1: z.string().trim().optional(),
  tollFree2: z.string().trim().optional(),
  callUs1: z.string().trim().optional(),
  callUs2: z.string().trim().optional(),
  nriWithinIndia: z.string().trim().optional(),
  nriOutsideIndia: z.string().trim().optional(),

  // Contact & Hours
  supportEmail: z.string().email().toLowerCase().optional(),
  businessHoursFrom: z.string().optional(),
  businessHoursTo: z.string().optional(),

  // Caution
  cautionEnabled: z.boolean().optional(),
  cautionText: z.string().trim().optional(),

  // Travel Planner
  travelPlannerEnabled: z.boolean().optional(),
  travelPlannerLabel: z.string().trim().optional(),
  travelPlannerLink: z.string().trim().optional(),
});

export type SettingsUpdateInput = z.infer<typeof settingsUpdateValidation>;
