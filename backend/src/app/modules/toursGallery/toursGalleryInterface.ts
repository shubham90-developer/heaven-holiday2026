import { Document } from 'mongoose';

// Single combined interface for Mongoose model
export interface IGalleryDocument extends Document {
  title: string;
  subtitle: string;
  images: Array<{
    src: string;
    alt: string;

    isFeatured?: boolean;
    _id?: string;
  }>;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating a new gallery (without auto-generated fields)
export interface ICreateGallery {
  title: string;
  subtitle: string;
  images: Array<{
    src: string;
    alt: string;
    order: number;
    isFeatured?: boolean;
  }>;
  isActive?: boolean;
}

// For updating gallery (all fields optional)
export interface IUpdateGallery {
  title?: string;
  subtitle?: string;
  images?: Array<{
    src: string;
    alt: string;
    order: number;
    isFeatured?: boolean;
    _id?: string;
  }>;
  isActive?: boolean;
}
