import { Document, Types } from 'mongoose';

// Subdocument: a single banner object
export interface IBanner extends Document {
  image: string;
  status: 'active' | 'inactive';
}
