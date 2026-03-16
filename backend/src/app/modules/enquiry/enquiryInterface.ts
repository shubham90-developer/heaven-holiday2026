import { Document } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  mono: string;
  message: string;
  email: string;
  modeOfCommunication?: 'call' | 'email';
  destinations: string;
  status: 'active' | 'inactive';
}
