// models/empowering.model.ts
import mongoose, { Schema } from 'mongoose';
import { IEmpowering } from './empoweringInterface';

const empoweringSchema = new Schema<IEmpowering>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters'],
    },
    paragraphs: {
      type: [String],
      required: [true, 'At least one paragraph is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one paragraph must be provided',
      },
    },
    footerTitle: {
      type: String,
      required: [true, 'Footer title is required'],
      trim: true,
      maxlength: [200, 'Footer title cannot exceed 200 characters'],
    },
    disclaimer: {
      type: String,
      required: [true, 'Disclaimer is required'],
      trim: true,
      maxlength: [1000, 'Disclaimer cannot exceed 1000 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const Empowering = mongoose.model<IEmpowering>(
  'Empowering',
  empoweringSchema,
);
