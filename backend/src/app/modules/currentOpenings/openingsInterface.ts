import { Types } from 'mongoose';

export interface IJobItem {
  _id?: Types.ObjectId;
  department: Types.ObjectId;
  jobTitle: string;
  jobDescription: string;
  type: 'Full Time' | 'Part Time' | 'Contract' | 'Internship';
  location: Types.ObjectId;
  url: string;
  status: 'active' | 'inactive' | 'closed';
}

export interface IDepartment {
  name: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILocation {
  name: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJob {
  title: string;
  subtitle: string;
  jobs: IJobItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
