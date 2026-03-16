// models/annualReturnInterface.ts
import { Document, Types } from 'mongoose';

export interface IAnnualReturnItem {
  _id?: Types.ObjectId;
  title: string;
  particulars: string; // PDF URL or file path
  status: 'active' | 'inactive';
}

export interface IAnnualReturn extends Document {
  items: Types.DocumentArray<IAnnualReturnItem>;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
