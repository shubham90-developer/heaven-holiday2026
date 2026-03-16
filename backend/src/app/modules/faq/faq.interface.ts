// types/faq.types.ts
import { Document } from 'mongoose';

export interface ICategory {
  category: string;
  isActive: boolean;
}

export interface IFAQItem {
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export interface IFAQ extends Document {
  categories: ICategory[];
  faqs: IFAQItem[];
  createdAt: Date;
  updatedAt: Date;
}
