import mongoose, { Schema } from 'mongoose';

import { IOfferBanner } from './offer-banner.interface';

const offerBannerSchema: Schema = new Schema({
  banners: [
    {
      image: {
        type: String,
        required: true,
        default: '<p>offer banner<p>',
      },
      link: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
      },
    },
  ],
});

export const OfferBanner = mongoose.model<IOfferBanner>(
  'OfferBanner',
  offerBannerSchema,
);
