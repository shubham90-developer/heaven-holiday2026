import mongoose from 'mongoose';

import { IOnlineBooking } from './bookingInterface';

// Step Schema
const stepSchema = new mongoose.Schema(
  {
    stepNo: {
      type: Number,
      required: true,
      min: 1,
    },
    stepTitle: {
      type: String,
      required: true,
      trim: true,
    },
    stepDescription: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

// Online Booking Schema
const onlineBookingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Online Booking',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    steps: {
      type: [stepSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
onlineBookingSchema.index({ createdAt: -1 });

const OnlineBooking = mongoose.model<IOnlineBooking>(
  'OnlineBooking',
  onlineBookingSchema,
);

export default OnlineBooking;
