import { Document } from 'mongoose';

export interface IEmpowering extends Document {
  title: string;
  subtitle: string;
  paragraphs: string[];
  footerTitle: string;
  disclaimer: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
