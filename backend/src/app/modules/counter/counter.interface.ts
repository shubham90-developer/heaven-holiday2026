import { Document } from 'mongoose';

export interface ICounter extends Document {
  title: string;
  subTitle: string;
  guests: number;
  toursCompleted: number;
  tourExpert: number;
  tourDestination: number;
  bigTravelCompany: string;
  createdAt?: Date;
  updatedAt?: Date;
}
