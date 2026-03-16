import { Document, Types } from 'mongoose';

// Subdocument: a single banner object
export interface IBanner extends Document {
  image: string;
  link: string;
  status: 'active' | 'inactive';
}

// Main document: HeroBanner
export interface IHeroBanner extends Document {
  banners: Types.DocumentArray<IBanner>; // array of banner objects
}
