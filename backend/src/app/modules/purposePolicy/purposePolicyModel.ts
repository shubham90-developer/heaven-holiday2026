import { Schema } from 'mongoose';
import mongoose from 'mongoose';

import { IPurposePolicy } from './purposepolicyInterface';
const PurposePolicySchema: Schema = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    cards: [
      {
        img: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ['Active', 'Inactive'],
          default: 'Active',
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.createdAt = new Date(ret.createdAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
        ret.updatedAt = new Date(ret.updatedAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
      },
    },
  },
);
export const PurposePolicy = mongoose.model<IPurposePolicy>(
  'PurposePolicy',
  PurposePolicySchema,
);
