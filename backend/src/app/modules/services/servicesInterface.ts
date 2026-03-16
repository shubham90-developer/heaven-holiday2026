import { Document } from 'mongoose';

export interface IItem {
  icon: string;
  iconTitle: string;
  iconDescription: string;
  status?: 'active' | 'inactive'; // optional, default is 'active'
}

export interface IMain {
  title: string;
  subtitle: string;
  items: IItem[];
}

export interface IMainDocument extends IMain, Document {
  createdAt: Date;
  updatedAt: Date;
}
