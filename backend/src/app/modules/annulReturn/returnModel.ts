// models/annualReturnModel.ts
import mongoose, { Schema } from 'mongoose';

import { IAnnualReturn, IAnnualReturnItem } from './returnInterface';

const annualReturnItemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    particulars: {
      type: String,
      required: [true, 'Particulars (PDF URL) is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { _id: true },
);

const annualReturnSchema: Schema = new Schema(
  {
    items: {
      type: [annualReturnItemSchema],
      default: [],
      validate: {
        validator: function (items: IAnnualReturnItem[]) {
          return items.length <= 50;
        },
        message: 'Maximum 50 items allowed',
      },
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

export const AnnualReturn = mongoose.model<IAnnualReturn>(
  'AnnualReturn',
  annualReturnSchema,
);
