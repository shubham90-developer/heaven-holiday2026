import mongoose from 'mongoose';
import { IFooterInfo } from './footerInfoInterface';

const footerInfoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const FooterInfo = mongoose.model<IFooterInfo>(
  'FooterInfo',
  footerInfoSchema,
);
