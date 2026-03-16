import { Document } from 'mongoose';
export interface ITourManagers extends Document {
  title: string;
  subtitle: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
