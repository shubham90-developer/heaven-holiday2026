import mongoose, { Model } from 'mongoose';
import { IGalleryDocument } from './toursGalleryInterface';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Kashmir to Kanyakumari, Iceland to Antartica',
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      default: 'Celebrating life on tour everyday',
    },
    images: [
      {
        src: {
          type: String,
          required: true,
          trim: true,
        },
        alt: {
          type: String,
          required: true,
          trim: true,
        },

        isFeatured: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Gallery = mongoose.model<IGalleryDocument>('ToursGallery', gallerySchema);

export default Gallery;
