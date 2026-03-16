import { Document } from 'mongoose';
export interface IBook extends Document {
  _id: string;
  coverImg: string;
  title: string;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
