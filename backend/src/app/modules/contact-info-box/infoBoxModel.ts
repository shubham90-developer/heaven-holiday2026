// models/contactfeatures.model.ts
import mongoose, { Schema } from 'mongoose';
import { IContactFeatures, IFeature, IHighlight } from './infoBoxInterface';

const featureSchema = new Schema<IFeature>(
  {
    title: {
      type: String,
      required: [true, 'Feature title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Feature description is required'],
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const highlightSchema = new Schema<IHighlight>(
  {
    message: {
      type: String,
      required: [true, 'Highlight message is required'],
      trim: true,
      maxlength: [300, 'Message cannot exceed 300 characters'],
    },
    happyTravellers: {
      type: String,
      required: [true, 'Happy travellers count is required'],
      trim: true,
    },
    successfulTours: {
      type: String,
      required: [true, 'Successful tours count is required'],
      trim: true,
    },
  },
  { _id: false },
);

const contactFeaturesSchema = new Schema<IContactFeatures>(
  {
    features: {
      type: [featureSchema],
      default: [],
    },
    highlight: {
      type: highlightSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for faster queries
contactFeaturesSchema.index({ 'features.order': 1 });
contactFeaturesSchema.index({ 'features.isActive': 1 });

export const ContactFeatures = mongoose.model<IContactFeatures>(
  'ContactFeatures',
  contactFeaturesSchema,
);
