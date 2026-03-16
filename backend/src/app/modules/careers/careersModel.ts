// models/Careers.ts
import mongoose, { Schema, Model } from 'mongoose';
import { ICareers } from './careersInterface';

const CareersSchema = new Schema<ICareers>(
  {
    title: {
      type: String,
      default: 'Welcome to our World!',
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default:
        'Come join our team at Heaven Holiday to experience an exciting workplace culture, fantastic colleagues, and a people-first community that empowers you to grow.',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    buttonText: {
      type: String,
      default: 'View current openings',
      trim: true,
      maxlength: [50, 'Button text cannot exceed 50 characters'],
    },
    buttonLink: {
      type: String,
      default: '/careers',
      trim: true,
    },
    videoThumbnail: {
      type: String,
      default: '/assets/img/about/1.avif',
      trim: true,
    },
    videoUrl: {
      type: String,
      default: 'https://www.youtube.com/embed/5acM-mzLTaU?si=YUw-L4EWkRHsn9ar',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Careers: Model<ICareers> =
  mongoose.models.Careers || mongoose.model<ICareers>('Careers', CareersSchema);

export default Careers;
