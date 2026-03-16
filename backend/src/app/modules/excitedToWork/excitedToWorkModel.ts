// models/excitedtowork.model.ts
import mongoose, { Schema } from 'mongoose';
import { IExcitedToWork } from './excitedToWorkInterface';

const excitedToWorkSchema = new Schema<IExcitedToWork>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
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

export const ExcitedToWork = mongoose.model<IExcitedToWork>(
  'ExcitedToWork',
  excitedToWorkSchema,
);
