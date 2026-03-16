import mongoose, { Schema } from 'mongoose';
import IForm from './formInterface';
const formSchema = new Schema<IForm>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'rejected'],
      default: 'pending',
    },
    cardTitle: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const BecomePartnerForm = mongoose.model<IForm>(
  'BecomePartnerForm',
  formSchema,
);
