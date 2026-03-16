import mongoose, { Schema } from 'mongoose';
import { required } from 'zod/v4/core/util.cjs';
import { IHeroBanner } from './bannerInterface';

const HeroBannerSchema: Schema = new Schema({
  banners: [
    {
      image: {
        type: String,
        required: true,
        default: '<p>Hero banner<p>',
      },
      link: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['active', 'inactive'], // Only allow these two values
        default: 'inactive',
      },
    },
  ],
});

export const HeroBanner = mongoose.model<IHeroBanner>(
  'HeroBanner',
  HeroBannerSchema,
);
