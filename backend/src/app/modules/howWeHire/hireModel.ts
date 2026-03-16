// models/howWeHire.model.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IHowWeHire } from './hireInterface';

const HowWeHireStepSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    img: {
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
  { _id: true },
);

const HowWeHireSchema = new Schema<IHowWeHire>(
  {
    heading: {
      type: String,
      required: true,
      default: 'How we hire',
      trim: true,
    },
    introText: {
      type: String,
      required: true,
      trim: true,
    },
    subText: {
      type: String,
      required: true,
      trim: true,
    },
    steps: {
      type: [HowWeHireStepSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const HowWeHire: Model<IHowWeHire> = mongoose.model<IHowWeHire>(
  'HowWeHire',
  HowWeHireSchema,
);
