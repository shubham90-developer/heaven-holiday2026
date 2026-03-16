import mongoose, { Schema } from 'mongoose';
import { IPrinciple } from './principlesInterface';

const detailSchema = new Schema({
  subtitle: {
    type: String,
    required: true,
  },
  principleDescription: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    enum: [
      'from-gray-700 to-yellow-800',
      'from-pink-500 to-purple-600',
      'from-blue-500 to-indigo-600',
      'from-green-500 to-teal-600',
      'from-red-500 to-orange-600',
      'from-cyan-500 to-blue-600',
      'from-violet-500 to-purple-600',
      'from-amber-500 to-yellow-600',
    ],
    default: 'from-blue-500 to-indigo-600',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
});

const principleSchema = new Schema<IPrinciple>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: [detailSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Principle = mongoose.model<IPrinciple>(
  'Principle',
  principleSchema,
);
