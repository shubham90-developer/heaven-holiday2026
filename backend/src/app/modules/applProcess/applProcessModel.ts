import mongoose, { Schema } from 'mongoose';
import IApplicationProcess from './applProcessInterface';
const applicationProcessSchema = new Schema<IApplicationProcess>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ApplicationProcess = mongoose.model<IApplicationProcess>(
  'ApplicationProcess',
  applicationProcessSchema,
);
