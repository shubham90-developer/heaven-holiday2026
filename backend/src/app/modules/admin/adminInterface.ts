import mongoose, { Document } from 'mongoose';

export interface IAdmin {
  username: string;
  email: string;
  password: string;
  role?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdminPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface IAdminDocument extends IAdmin, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}
