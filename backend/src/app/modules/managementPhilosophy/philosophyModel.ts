import mongoose, { Schema } from 'mongoose';
import { IManagement } from './philosophyInterface';

const ManagementSchema: Schema = new Schema(
  {
    heading: {
      type: String,
      default: '',
    },
    paragraph: {
      type: String,
      default: '',
    },
    cards: {
      type: [
        {
          name: {
            type: String,
            default: '',
          },
          image: {
            type: String,
            default: '',
          },
          status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
          },
        },
      ],
      default: [],
    },
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

export const Management =
  mongoose.models.Management ||
  mongoose.model<IManagement>('Management', ManagementSchema);
