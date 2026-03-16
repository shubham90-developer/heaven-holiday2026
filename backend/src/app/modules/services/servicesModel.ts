import mongoose, { Document, Schema } from 'mongoose';
import { IItem, IMainDocument } from './servicesInterface';

const itemSchema = new Schema<IItem>(
  {
    icon: {
      type: String,
      required: true,
    },
    iconTitle: {
      type: String,
      required: true,
    },
    iconDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { _id: false },
);

const mainSchema = new Schema<IMainDocument>(
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
    items: {
      type: [itemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const MainModel =
  mongoose.models.Main || mongoose.model<IMainDocument>('Main', mainSchema);

export default MainModel;
