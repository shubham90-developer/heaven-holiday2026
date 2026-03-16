import { Document } from 'mongoose';
export interface IPurposePolicy extends Document {
  heading: string;
  subtitle: string;
  cards: {
    _id?: string;
    img: string;
    description: string;
    status: 'Active' | 'Inactive';
  }[];
  createdAt: Date;
  updatedAt: Date;
}
