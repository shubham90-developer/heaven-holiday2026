// schema.ts
import mongoose, { Schema } from 'mongoose';
import { IIncludes } from './toursIncludedInterface';

const IncludesSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'draft',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Includes = mongoose.model<IIncludes>('Includes', IncludesSchema);
