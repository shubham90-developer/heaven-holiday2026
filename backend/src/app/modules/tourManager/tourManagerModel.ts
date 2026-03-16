import mongoose, { Schema } from 'mongoose';
import { ITourManagers } from './tourManagerInterface';

const TourManagerSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
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

export const TourManager = mongoose.model<ITourManagers>(
  'TourManager',
  TourManagerSchema,
);
