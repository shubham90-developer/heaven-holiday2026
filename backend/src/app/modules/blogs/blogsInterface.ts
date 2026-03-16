import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface CategoryDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
}

export interface BlogPostDocument extends Document {
  title: string;
  date: number;
  readTime: string;
  hero: string;
  tags: string[];
  category: mongoose.Types.ObjectId | string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  comments: {
    commentBody: string;
    created_at: Date;
    status: 'active' | 'inactive';
  }[];
}
