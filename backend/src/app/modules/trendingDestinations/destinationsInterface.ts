import { Document } from 'mongoose';

export interface ITrendingDestination extends Document {
  title: string;
  destinations: {
    _id?: string;
    title: string;
    image: string;
    tours: number;
    departures: number;
    guests: number;
    category: 'World' | 'India';
    status: 'active' | 'inactive';
    order: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
