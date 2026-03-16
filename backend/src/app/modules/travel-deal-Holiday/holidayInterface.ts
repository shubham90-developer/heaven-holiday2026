import { Document, Types } from 'mongoose';

export interface IFeature {
  _id?: Types.ObjectId;
  title: string;
  description: string;
}

export interface IHolidaySection extends Document {
  heading: string;
  subheading: string;
  features: Types.DocumentArray<IFeature>;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
