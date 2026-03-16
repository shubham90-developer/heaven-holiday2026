import mongoose, { Schema } from 'mongoose';
import { IVideoBlog, ICategory } from './videoBolgInterface';

// ========== VIDEO BLOG SCHEMA (Multiple Documents) ==========
const videoBlogSchema = new Schema<IVideoBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

const VideoBlog = mongoose.model<IVideoBlog>('VideoBlog', videoBlogSchema);

const categorySchema = new Schema<ICategory>(
  {
    categories: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        status: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'active',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model<ICategory>('CategoryV3', categorySchema);

export default VideoBlog;
export { Category };
