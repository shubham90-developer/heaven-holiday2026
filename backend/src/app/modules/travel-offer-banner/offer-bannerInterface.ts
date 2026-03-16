// models/celebrateInterface.ts
import { Document, Types } from 'mongoose';

export interface ISlide {
  _id?: Types.ObjectId;
  image: string;
  link: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface ICelebrate extends Document {
  heading: string;
  slides: Types.DocumentArray<ISlide>;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
