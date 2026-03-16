// jobApplication.interface.ts
import { Document } from 'mongoose';

export interface IJobApplication extends Document {
  fullName: string;
  phone: string;
  email: string;
  currentCity: string;
  yearsOfExperience: number;
  noticePeriod: string;
  joiningAvailability: string;
  currentCTC: string;
  expectedCTC: string;
  resume: string; // File path or URL
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: Date;
  updatedAt: Date;
}
