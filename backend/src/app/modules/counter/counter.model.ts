// counter.model.ts
import mongoose from 'mongoose';
import { ICounter } from './counter.interface';

const CounterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    toursCompleted: {
      type: Number,
      required: true,
    },
    tourExpert: {
      type: Number,
      required: true,
    },
    tourDestination: {
      type: Number,
      required: true,
    },
    bigTravelCompany: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Counter = mongoose.model<ICounter>('Counter', CounterSchema);
