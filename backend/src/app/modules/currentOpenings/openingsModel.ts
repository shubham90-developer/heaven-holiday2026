// models/openings.ts
import mongoose, { Schema, Model } from 'mongoose';
import { IJob, IDepartment, ILocation } from './openingsInterface';

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Department name must be at least 2 characters'],
      maxlength: [100, 'Department name cannot exceed 100 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'job_departments',
  },
);

// Create indexes
DepartmentSchema.index({ name: 1 });
DepartmentSchema.index({ isActive: 1 });

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Location name must be at least 2 characters'],
      maxlength: [100, 'Location name cannot exceed 100 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'job_locations',
    _id: true,
  },
);

LocationSchema.index({ name: 1 });
LocationSchema.index({ isActive: 1 });

const JobItemSchema = new Schema(
  {
    department: {
      type: Schema.Types.ObjectId,
      ref: 'JobDepartment',
      required: [true, 'Department is required'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [5, 'Job title must be at least 5 characters'],
      maxlength: [200, 'Job title cannot exceed 200 characters'],
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [5, 'Job description must be at least 5 characters'],
      maxlength: [5000, 'Job title cannot exceed 700 characters'],
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      trim: true,
      enum: {
        values: ['Full Time', 'Part Time', 'Contract', 'Internship'],
        message: '{VALUE} is not a valid job type',
      },
      default: 'Full Time',
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'JobLocation',
      required: [true, 'Location is required'],
    },
    url: {
      type: String,
      required: [true, 'Job URL is required'],
      trim: true,
      default: '/careers/careers-details',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
  },
  { _id: true },
);

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'Current Openings',
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
      maxlength: [500, 'Subtitle cannot exceed 500 characters'],
      default:
        "We're currently looking to fill the following roles on our team.",
    },
    jobs: {
      type: [JobItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'job_openings',
  },
);

// Create indexes
JobSchema.index({ 'jobs.department': 1 });
JobSchema.index({ 'jobs.location': 1 });
JobSchema.index({ 'jobs.status': 1 });
JobSchema.index({ createdAt: -1 });

export const Department: Model<IDepartment> = mongoose.model<IDepartment>(
  'JobDepartment',
  DepartmentSchema,
);

export const Location: Model<ILocation> = mongoose.model<ILocation>(
  'JobLocation',
  LocationSchema,
);

export const Job: Model<IJob> = mongoose.model<IJob>('JobOpening', JobSchema);
