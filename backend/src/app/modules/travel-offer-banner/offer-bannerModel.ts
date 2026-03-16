// models/celebrateModel.ts
import mongoose, { Schema } from 'mongoose';

import { ICelebrate, ISlide } from './offer-bannerInterface';

const slideSchema = new Schema(
  {
    image: {
      type: String,
      required: [true, 'Slide image is required'],
      trim: true,
    },
    link: {
      type: String,
      required: [true, 'Slide link is required'],
      trim: true,
      default: '/tour-details',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    order: {
      type: Number,
      required: [true, 'Slide order is required'],
      min: [1, 'Order must be at least 1'],
    },
  },
  { _id: true },
);

const celebrateSchema: Schema = new Schema(
  {
    heading: {
      type: String,
      required: [true, 'Heading is required'],
      trim: true,
      maxlength: [200, 'Heading cannot exceed 200 characters'],
      default: 'Travel. Explore. Celebrate.',
    },
    slides: {
      type: [slideSchema],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

export const Celebrate = mongoose.model<ICelebrate>(
  'Celebrate',
  celebrateSchema,
);
