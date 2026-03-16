import { Document } from 'mongoose';
// TypeScript Interface
export interface IFAQ extends Document {
  question: string;
  answer: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}
