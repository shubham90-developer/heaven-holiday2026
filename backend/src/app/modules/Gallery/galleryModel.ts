import mongoose, { Schema } from 'mongoose';
import { IGallery } from './galleryInterface';

const GallerySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'active',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
