// models/Feedback.ts
import mongoose, { Schema, Model } from 'mongoose';
import { IFeedback } from './feedbackInterface';

const FeedbackSchema = new Schema<IFeedback>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address',
      },
    },
    experience: {
      type: String,
      required: [true, 'Experience description is required'],
      trim: true,
      minlength: [10, 'Experience must be at least 10 characters'],
      maxlength: [2000, 'Experience cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  },
);

const Feedback: Model<IFeedback> = mongoose.model<IFeedback>(
  'Feedback',
  FeedbackSchema,
);

export default Feedback;
