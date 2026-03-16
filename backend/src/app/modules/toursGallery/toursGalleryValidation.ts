import { z } from 'zod';

// Image validation schema
export const galleryImageSchema = z.object({
  src: z.string().min(1, 'Image source is required').trim(),
  alt: z.string().min(1, 'Alt text is required').trim(),

  isFeatured: z.boolean().optional().default(false),
  _id: z.string().optional(),
});

// Create single image (for adding to gallery)
export const createImageSchema = z.object({
  src: z.string().min(1, 'Image source is required').trim(),
  alt: z.string().min(1, 'Alt text is required').trim(),

  isFeatured: z.boolean().optional().default(false),
});

// Update single image
export const updateImageSchema = z.object({
  src: z.string().min(1, 'Image source is required').trim().optional(),
  alt: z.string().min(1, 'Alt text is required').trim().optional(),

  isFeatured: z.boolean().optional(),
});

// Update gallery (only title and subtitle)
export const updateGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').trim().optional(),
  subtitle: z.string().min(1, 'Subtitle is required').trim().optional(),
});

// Create initial gallery
export const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  subtitle: z.string().min(1, 'Subtitle is required').trim(),
  images: z.array(createImageSchema).min(1, 'At least one image is required'),
  isActive: z.boolean().optional().default(true),
});

// Export types
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
export type CreateImageInput = z.infer<typeof createImageSchema>;
export type UpdateImageInput = z.infer<typeof updateImageSchema>;
export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
