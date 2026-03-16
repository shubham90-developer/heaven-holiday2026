import mongoose, { Schema, Document, Model } from 'mongoose';
import { CategoryDocument, BlogPostDocument } from './blogsInterface';

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

const BlogPostSchema = new Schema<BlogPostDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    date: {
      type: Number,
      required: [true, 'Date is required'],
    },
    readTime: {
      type: String,
      required: [true, 'Read time is required'],
      trim: true,
    },
    hero: {
      type: String,
      required: [true, 'Hero image is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'CategoryV2',
      required: [true, 'Category is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      required: [true, 'Status is required'],
    },
    comments: [
      {
        commentBody: {
          type: String,
          required: [true, 'Comment body is required'],
          trim: true,
        },
        created_at: {
          type: Date,
          default: Date.now,
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

BlogPostSchema.index({ status: 1, date: -1 });
BlogPostSchema.index({ category: 1, status: 1 });
BlogPostSchema.index({ tags: 1 });

export const Category = mongoose.model<CategoryDocument>(
  'CategoryV2',
  CategorySchema,
);
export const BlogPost = mongoose.model<BlogPostDocument>(
  'BlogPost',
  BlogPostSchema,
);
