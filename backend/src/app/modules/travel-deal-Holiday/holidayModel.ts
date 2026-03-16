// models/holidaySectionModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IFeature, IHolidaySection } from './holidayInterface';

const featureSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Feature title is required'],
      trim: true,
      maxlength: [100, 'Feature title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Feature description is required'],
      trim: true,
      maxlength: [500, 'Feature description cannot exceed 500 characters'],
    },
  },
  { _id: true },
);

const holidaySectionSchema: Schema = new Schema(
  {
    heading: {
      type: String,
      required: [true, 'Heading is required'],
      trim: true,
      maxlength: [200, 'Heading cannot exceed 200 characters'],
    },
    subheading: {
      type: String,
      required: [true, 'Subheading is required'],
      trim: true,
      maxlength: [500, 'Subheading cannot exceed 500 characters'],
    },
    features: {
      type: [featureSchema],
      required: [true, 'At least one feature is required'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
  },
  {
    timestamps: true,
  },
);

export const HolidaySection = mongoose.model<IHolidaySection>(
  'HolidaySection',
  holidaySectionSchema,
);
