import { Document, Types } from 'mongoose';

export interface IOfferBanner extends Document {
  image: string;
  link: string;
  status: 'active' | 'inactive';
}

export interface IOfferBanner extends Document {
  banners: Types.DocumentArray<IOfferBanner>;
}
