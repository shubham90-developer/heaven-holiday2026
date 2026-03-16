// interface.ts
import { Document } from 'mongoose';

export interface IIncludes extends Document {
  title: string;
  image: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
