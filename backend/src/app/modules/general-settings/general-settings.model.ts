import { Schema, model, models } from 'mongoose';
import { IGeneralSettingsDocument } from './general-settings.interface';

const GeneralSettingsSchema = new Schema<IGeneralSettingsDocument>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      default: 'Heaven Holiday',
    },
    companyLogo: {
      type: String,
      trim: true,
      default: '',
    },
    paymentGateways: {
      type: String,
      trim: true,
      default: '',
    },
    favicon: {
      type: String,
      trim: true,
      default: '',
    },
    copyrightText: {
      type: String,
      trim: true,
      default: '© 2025 Heaven Holiday. All rights reserved.',
    },

    tollFree1: {
      type: String,
      trim: true,
      default: '',
    },
    tollFree2: {
      type: String,
      trim: true,
      default: '',
    },
    callUs1: {
      type: String,
      trim: true,
      default: '',
    },
    callUs2: {
      type: String,
      trim: true,
      default: '',
    },
    nriWithinIndia: {
      type: String,
      trim: true,
      default: '',
    },
    nriOutsideIndia: {
      type: String,
      trim: true,
      default: '',
    },

    supportEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    businessHoursFrom: {
      type: String,
      trim: true,
      default: '10:00',
    },
    businessHoursTo: {
      type: String,
      trim: true,
      default: '19:00',
    },

    cautionEnabled: {
      type: Boolean,
      default: false,
    },
    cautionText: {
      type: String,
      trim: true,
      default: '',
    },

    travelPlannerEnabled: {
      type: Boolean,
      default: true,
    },
    travelPlannerLabel: {
      type: String,
      trim: true,
      default: 'Plan My Trip',
    },
    travelPlannerLink: {
      type: String,
      trim: true,
      default: '/plan-trip',
    },
  },
  {
    timestamps: true,
  },
);

export const GeneralSettings = model<IGeneralSettingsDocument>(
  'GeneralSettings',
  GeneralSettingsSchema,
);
