// interfaces/howWeHire.interface.ts
import { Document, Types } from 'mongoose';

export interface IHowWeHireStep {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  img: string;
  status: 'active' | 'inactive';
}

export interface IHowWeHire extends Document {
  heading: string;
  introText: string;
  subText: string;
  steps: Types.DocumentArray<IHowWeHireStep>;
  createdAt?: Date;
  updatedAt?: Date;
}
