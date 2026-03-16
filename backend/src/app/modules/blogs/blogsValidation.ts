import { z } from 'zod';

// Category Schema
export const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
});

// Comment Schema
export const CommentSchema = z.object({
  commentBody: z.string().min(1, 'Comment body is required'),
  created_at: z.date().default(() => new Date()),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Blog Post Schema
export const BlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.number().int().positive('Date must be a valid timestamp'),
  readTime: z.string().min(1, 'Read time is required'),
  hero: z.string().min(1, 'Hero image is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'archived']),
  comments: z.array(CommentSchema).default([]),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
export type CommentInput = z.infer<typeof CommentSchema>;
export type BlogPostInput = z.infer<typeof BlogPostSchema>;
