// models/Brand.model.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IBrand, IIndustry, IBrandsSection } from './brandsInterface';

// Brand Schema
const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },

    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Industry Schema
const IndustrySchema = new Schema<IIndustry>(
  {
    image: {
      type: String,
      required: [true, 'Industry logo is required'],
      unique: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Brands Section Schema
const BrandsSectionSchema = new Schema<IBrandsSection>(
  {
    heading: {
      type: String,
      required: [true, 'Heading is required'],
      default: 'Heaven holiday has proudly served 350+ corporates to date...',
    },

    brands: [BrandSchema],
    industries: [IndustrySchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
BrandSchema.index({ displayOrder: 1 });
IndustrySchema.index({ displayOrder: 1 });

// Models
export const Brand: Model<IBrand> = mongoose.model<IBrand>(
  'Brand',
  BrandSchema,
);

export const Industry: Model<IIndustry> = mongoose.model<IIndustry>(
  'Industry',
  IndustrySchema,
);

export const BrandsSection: Model<IBrandsSection> =
  mongoose.model<IBrandsSection>('BrandsSection', BrandsSectionSchema);
