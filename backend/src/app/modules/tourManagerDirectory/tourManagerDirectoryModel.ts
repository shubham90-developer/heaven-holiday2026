import mongoose, { Schema } from 'mongoose';
import {
  ITourManagerDirectory,
  IManager,
} from './tourManagerDirectoryInterface';

const ManagerSchema = new Schema<IManager>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { _id: true },
);

const TourManagerDirectorySchema: Schema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    managers: {
      type: [ManagerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        (ret as any).createdAt = new Date(
          (ret as any).createdAt,
        ).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
        (ret as any).updatedAt = new Date(
          (ret as any).updatedAt,
        ).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
        return ret;
      },
    },
  },
);

TourManagerDirectorySchema.index({ 'managers.name': 'text' });

export const TourManagerDirectory = mongoose.model<ITourManagerDirectory>(
  'TourManagerDirectory',
  TourManagerDirectorySchema,
);
