import { Document } from 'mongoose';

// ========== VIDEO BLOG INTERFACE ==========
export interface IVideoBlog extends Document {
  title: string;
  videoUrl: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

// ========== CATEGORY INTERFACES ==========
export interface ICategoryItem {
  name: string;
  status: 'active' | 'inactive';
  _id?: string;
}

export interface ICategory extends Document {
  categories: ICategoryItem[];
  createdAt: Date;
  updatedAt: Date;
}
