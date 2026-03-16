import { Document } from 'mongoose';

export interface IAboutus extends Document {
  aboutus: {
    title: string;
    description: string;
    video: string;
    thumbnail: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
