import { Document } from 'mongoose';
export default interface IApplicationProcess extends Document {
  title: string;
  description: string;
  image: string;
}
