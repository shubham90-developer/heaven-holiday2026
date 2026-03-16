// jobApplication.model.ts
import mongoose, { Schema, Model } from 'mongoose';
import { IJobApplication } from './applicationsInterface';

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
        'Please provide a valid phone number',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    currentCity: {
      type: String,
      required: [true, 'Current city is required'],
      trim: true,
      maxlength: [100, 'City name cannot exceed 100 characters'],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Years of experience cannot be negative'],
      max: [50, 'Years of experience cannot exceed 50'],
    },
    noticePeriod: {
      type: String,
      required: [true, 'Notice period is required'],
      trim: true,
      maxlength: [50, 'Notice period cannot exceed 50 characters'],
    },
    joiningAvailability: {
      type: String,
      required: [true, 'Joining availability is required'],
      trim: true,
      maxlength: [50, 'Joining availability cannot exceed 50 characters'],
    },
    currentCTC: {
      type: String,
      required: [true, 'Current CTC is required'],
      trim: true,
      maxlength: [50, 'Current CTC cannot exceed 50 characters'],
    },
    expectedCTC: {
      type: String,
      required: [true, 'Expected CTC is required'],
      trim: true,
      maxlength: [50, 'Expected CTC cannot exceed 50 characters'],
    },
    resume: {
      type: String,
      required: [true, 'Resume is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: 'job_applications',
  },
);

// Create indexes
JobApplicationSchema.index({ email: 1 });
JobApplicationSchema.index({ status: 1 });
JobApplicationSchema.index({ createdAt: -1 });

export const JobApplication: Model<IJobApplication> =
  mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
