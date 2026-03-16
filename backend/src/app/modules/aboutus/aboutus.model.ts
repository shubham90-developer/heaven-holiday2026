import mongoose, { Schema } from 'mongoose';
import { IAboutus } from './aboutus.interfaces';

const AboutusSchema = new Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    video: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
  },
  { _id: false },
);

const AboutUsSchema: Schema = new Schema(
  {
    aboutus: { type: AboutusSchema, default: {} },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        (ret as any).createdAt = new Date(
          (ret as any).createdAt,
        ).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        (ret as any).updatedAt = new Date(
          (ret as any).updatedAt,
        ).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      },
    },
  },
);

export const AboutUs = mongoose.model<IAboutus>('AboutUs', AboutUsSchema);
