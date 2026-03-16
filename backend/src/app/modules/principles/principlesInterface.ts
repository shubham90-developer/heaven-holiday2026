import { Document } from 'mongoose';

export interface IPrincipleDetail {
  subtitle: string;
  principleDescription: string;
  color: string;
  status: 'Active' | 'Inactive';
}

export interface IPrinciple extends Document {
  title: string;
  description: string;
  details: IPrincipleDetail[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
