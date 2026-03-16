// types/contactfeatures.types.ts
import { Document } from 'mongoose';

export interface IFeature {
  title: string;
  description: string;

  isActive: boolean;
}

export interface IHighlight {
  message: string;
  happyTravellers: string;
  successfulTours: string;
}

export interface IContactFeatures extends Document {
  features: IFeature[];
  highlight: IHighlight;
  createdAt: Date;
  updatedAt: Date;
}
