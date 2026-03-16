import mongoose, { Schema } from 'mongoose';
import { IPreamble } from './preambleInterface';

const PreambleSchema: Schema = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    paragraph: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    tableRows: [
      {
        title: {
          type: String,
          required: true,
        },
        particulars: {
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

export const Preamble = mongoose.model<IPreamble>('Preamble', PreambleSchema);
