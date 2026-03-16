// models/visaInfoModel.ts
import mongoose, { Schema } from 'mongoose';
import { IVisaInfo } from './singaporeVisaInterface';

const visaInfoSchema: Schema = new Schema(
  {
    heading: {
      type: String,
      required: [true, 'Heading is required'],
      trim: true,
      default: 'Visa Information',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

export const VisaInfo = mongoose.model<IVisaInfo>('VisaInfo', visaInfoSchema);
