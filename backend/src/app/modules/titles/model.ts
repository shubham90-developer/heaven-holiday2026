import mongoose, { Document, Schema } from 'mongoose';
import { IPageTitles } from './Interface';

export interface IPageTitlesDocument extends IPageTitles, Document {}

const PageTitlesSchema = new Schema<IPageTitlesDocument>(
  {
    offersTitle: { type: String, required: true, trim: true },
    offersSubtitle: { type: String, required: true, trim: true },
    servicesTitle: { type: String, required: true, trim: true },
    worldTitle: { type: String, required: true, trim: true },
    indiaTitle: { type: String, required: true, trim: true },
    blogsTitle: { type: String, required: true, trim: true },
    podcastTitle: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const PageTitles = mongoose.model<IPageTitlesDocument>(
  'PageTitles',
  PageTitlesSchema,
);
