import mongoose, { Schema, Document } from 'mongoose';
import { IFAQ } from './faqInterface';

// Mongoose Schema
const FAQSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      minlength: [5, 'Question must be at least 5 characters long'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
      minlength: [10, 'Answer must be at least 10 characters long'],
      maxlength: [2000, 'Answer cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'draft'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

FAQSchema.index({ status: 1 });
FAQSchema.index({ createdAt: -1 });

export const FAQ = mongoose.model<IFAQ>('CSRFAQ', FAQSchema);
