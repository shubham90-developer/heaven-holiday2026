import mongoose, { Schema, Document } from 'mongoose';

import { ICity } from './contactCities.interface';

const citySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true },
);

export const City = mongoose.model<ICity>('City', citySchema);
