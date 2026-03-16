// models/faq.model.ts
import mongoose, { Schema } from 'mongoose';
import { IFAQ, ICategory, IFAQItem } from './faq.interface';

const categorySchema = new Schema<ICategory>(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const faqItemSchema = new Schema<IFAQItem>(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
      maxlength: [2000, 'Answer cannot exceed 2000 characters'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const faqSchema = new Schema<IFAQ>(
  {
    categories: {
      type: [categorySchema],
      default: [],
    },
    faqs: {
      type: [faqItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for faster queries
faqSchema.index({ 'categories.category': 1 });
faqSchema.index({ 'categories.isActive': 1 });
faqSchema.index({ 'faqs.category': 1 });
faqSchema.index({ 'faqs.isActive': 1 });

export const FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);
