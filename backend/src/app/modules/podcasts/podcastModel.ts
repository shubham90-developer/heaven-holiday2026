import mongoose, { Schema } from 'mongoose';
import { IPodcast } from './podcastsInterface';
const podcastSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Podcast title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    episodes: {
      type: Number,
      default: 0,
      min: [0, 'Episodes cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
      maxlength: [50, 'Language cannot exceed 50 characters'],
    },
    cover: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    order: {
      type: Number,
      default: 0,
    },
    episodesList: [
      {
        title: {
          type: String,
          required: [true, 'Episode title is required'],
          trim: true,
          maxlength: [200, 'Episode title cannot exceed 200 characters'],
        },
        date: {
          type: Date,
          required: [true, 'Episode date is required'],
          default: Date.now,
        },
        duration: {
          type: String,
          required: [true, 'Episode duration is required'],
          trim: true,
        },
        audioUrl: {
          type: String,
          trim: true,
        },
        status: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'active',
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);
export const Podcast = mongoose.model<IPodcast>('Podcast', podcastSchema);
