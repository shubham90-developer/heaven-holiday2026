import { Document } from 'mongoose';
export interface IStep {
  stepNo: number;
  stepTitle: string;
  stepDescription: string;
  image?: string;
}

export interface IOnlineBooking extends Document {
  title: string;
  description: string;
  steps: IStep[];
  createdAt: Date;
  updatedAt: Date;
}
