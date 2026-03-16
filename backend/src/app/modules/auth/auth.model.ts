import mongoose, { Schema } from 'mongoose';

import { IUser } from './authInterface';

const userSchema: Schema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ['phone', 'google', 'email'],
      default: 'phone',
    },

    profileImg: {
      type: String,
    },
    name: {
      type: String,

      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    nationality: {
      type: String,
      default: 'Indian',
    },
    dateOfBirth: {
      type: Date,
    },

    address: {
      address: { type: String },
    },

    aadharCard: {
      frontImage: { type: String },
      backImage: { type: String },
    },

    panCard: {
      frontImage: { type: String },
      backImage: { type: String },
    },

    passport: {
      frontImage: { type: String },
      backImage: { type: String },
    },

    voterId: {
      frontImage: { type: String },
      backImage: { type: String },
    },

    birthCertificate: {
      frontImage: { type: String },
      backImage: { type: String },
    },

    drivingLicense: {
      frontImage: { type: String },
      backImage: { type: String },
    },

    visa: {
      frontImage: { type: String },
      backImage: { type: String },
    },

    otherDocument: {
      documentName: { type: String },

      frontImage: { type: String },
      backImage: { type: String },
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourPackageCard',
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.index({ firebaseUid: 1 }, { unique: true });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
