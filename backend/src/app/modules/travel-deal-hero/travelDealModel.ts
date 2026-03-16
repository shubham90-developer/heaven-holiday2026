import mongoose, { Schema } from 'mongoose';
import { IBanner } from './travelDealInterface';

const travelDealBanner: Schema = new Schema({
  image: {
    type: String,
    required: true,
    default: '<p>Travel Deal Banner <p>',
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
});

export const TravelDealBanner = mongoose.model<IBanner>(
  'TravelDealBanner',
  travelDealBanner,
);
