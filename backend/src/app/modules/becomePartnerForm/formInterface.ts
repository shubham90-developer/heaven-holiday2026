import { Document } from 'mongoose';

export default interface IForm extends Document {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  pincode: string;
  state: string;
  message: string;
  status: string;
  cardTitle: string;
}
