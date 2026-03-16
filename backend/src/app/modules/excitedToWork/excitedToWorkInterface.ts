// types/excitedtowork.types.ts
import { Document } from 'mongoose';

export interface IExcitedToWork extends Document {
  title: string;
  subtitle: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
