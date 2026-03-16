import { Document } from 'mongoose';
export default interface ICard extends Document {
  icon: string;
  title: string;
  description: string;
  cities: string[];
  status: string;
}
