import mongoose, { Schema } from 'mongoose';
import { IEnquiry } from './enquiryInterface';

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: true,
    },
    mono: {
      type: String,
      required: true,
    },
    destinations: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '-',
    },
    email: {
      type: String,
      default: '-',
    },
    modeOfCommunication: {
      type: String,
      enum: ['call', 'email'],
      default: 'call',
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

const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
