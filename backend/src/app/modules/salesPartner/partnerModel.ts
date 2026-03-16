import mongoose, { Schema } from 'mongoose';
import ICard from './partnerInterface';
const cardSchema = new Schema<ICard>(
  {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cities: {
      type: [String],
      required: true,
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

export const Card = mongoose.model<ICard>('Card', cardSchema);
