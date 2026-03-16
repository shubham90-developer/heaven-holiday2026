import { Document, Types } from 'mongoose';

export interface IBrand {
  name: string;
  industry: string;
  image: string;
  isActive: boolean;
}

export interface IIndustry {
  image: string;
  isActive: boolean;
}

export interface IBrandsSection extends Document {
  heading: string;
  brands: Types.DocumentArray<IBrand>;
  industries: Types.DocumentArray<IIndustry>;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
