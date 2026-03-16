import mongoose from 'mongoose';
import { IReview, ITourReviewDocument } from './reviewsInterface';

const reviewSchema = new mongoose.Schema<IReview>(
  {
    rating: { type: Number, min: 0, max: 5 },
    tag: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    guides: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

const tourReviewSchema = new mongoose.Schema<ITourReviewDocument>(
  {
    mainTitle: { type: String, required: true, trim: true },
    mainSubtitle: { type: String, required: true, trim: true },
    reviews: { type: [reviewSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const TourReview = mongoose.model<ITourReviewDocument>(
  'TourReview',
  tourReviewSchema,
);
