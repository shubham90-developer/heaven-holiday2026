import mongoose, { Schema, Document } from 'mongoose';
import { ITrendingDestination } from './destinationsInterface';

// Destination Schema
const trendingDestinationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      default: 'Trending Destinations',
    },

    destinations: [
      {
        title: {
          type: String,
          required: [true, 'Destination title is required'],
          trim: true,
        },
        image: {
          type: String,
          required: [true, 'Destination image is required'],
        },
        tours: {
          type: Number,
          required: [true, 'Number of tours is required'],
          min: [0, 'Tours cannot be negative'],
          default: 0,
        },
        departures: {
          type: Number,
          required: [true, 'Number of departures is required'],
          min: [0, 'Departures cannot be negative'],
          default: 0,
        },
        guests: {
          type: Number,
          required: [true, 'Number of guests is required'],
          default: '0',
        },
        category: {
          type: String,
          required: [true, 'Category is required'],
          enum: {
            values: ['World', 'India'],
            message: 'Category must be either World or India',
          },
        },
        status: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'active',
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
trendingDestinationSchema.index({ 'destinations.category': 1 });
trendingDestinationSchema.index({ 'destinations.status': 1 });

export const TrendingDestination = mongoose.model<ITrendingDestination>(
  'TrendingDestination',
  trendingDestinationSchema,
);
