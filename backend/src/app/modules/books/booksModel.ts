import mongoose, { Schema } from 'mongoose';
import { IBook } from './booksInterface';

const BookSchema = new Schema<IBook>(
  {
    coverImg: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model<IBook>('Book', BookSchema);

export default Book;
