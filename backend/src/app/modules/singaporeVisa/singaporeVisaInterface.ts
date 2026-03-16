import { Document } from 'mongoose';

export interface IVisaInfo extends Document {
  heading: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
