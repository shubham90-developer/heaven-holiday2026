// models/Content.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IContent } from './messageInterface';

interface IContentDocument extends IContent, Document {}

const ButtonSchema = new Schema(
  {
    text: { type: String, default: 'Join Our Family', required: true },
    link: { type: String, default: '#', required: true },
  },
  { _id: false },
);

const ContentSchema: Schema<IContentDocument> = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Come, lets grow together!',
    },
    subtitle: { type: String, required: true, default: '' },
    description: { type: String, required: true, default: '' },
    button: { type: ButtonSchema, default: () => ({}) },
  },
  { timestamps: true },
);

const Content = mongoose.model<IContentDocument>('Content', ContentSchema);

export default Content;
