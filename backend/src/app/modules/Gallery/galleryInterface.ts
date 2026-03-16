import { Document } from 'mongoose';

export interface IImage {
  _id?: string;
  url: string;
  status?: string; // ✅ ADD THIS
  createdAt?: Date;
}

export interface IGallery extends Document {
  title: string;
  subtitle: string;
  images: IImage[];
  createdAt?: Date;
  updatedAt?: Date;
}
