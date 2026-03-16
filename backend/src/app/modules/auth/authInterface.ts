import { Document, Types } from 'mongoose';
export interface IUser extends Document {
  firebaseUid: string;
  authProvider: 'phone' | 'google' | 'email';

  profileImg?: string;
  name: string;
  email: string;
  phone: string;

  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  dateOfBirth?: Date;

  address?: {
    address?: string;
  };

  aadharCard?: {
    frontImage?: string;
    backImage?: string;
  };

  panCard?: {
    frontImage?: string;
    backImage?: string;
  };

  passport?: {
    frontImage?: string;
    backImage?: string;
  };

  voterId?: {
    frontImage?: string;
    backImage?: string;
  };

  birthCertificate?: {
    frontImage?: string;
    backImage?: string;
  };

  drivingLicense?: {
    frontImage?: string;
    backImage?: string;
  };

  visa?: {
    frontImage?: string;
    backImage?: string;
  };

  otherDocument?: {
    documentName?: string;
    frontImage?: string;
    backImage?: string;
  };
  wishlist: Types.ObjectId[];

  role: 'admin' | 'user';
  accountStatus: 'active' | 'inactive' | 'pending';
  emailVerified?: boolean;
  phoneVerified?: boolean;
}
