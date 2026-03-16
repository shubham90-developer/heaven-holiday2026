import { Document, Types } from 'mongoose';

export interface IManager {
  _id?: Types.ObjectId;
  name: string;
  image: string;
  status: 'Active' | 'Inactive';
}

export interface ITourManagerDirectory extends Document {
  heading: string;
  managers: IManager[];
  createdAt: Date;
  updatedAt: Date;
}
