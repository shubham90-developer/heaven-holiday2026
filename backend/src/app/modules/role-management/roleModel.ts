// src/modules/role/roleModel.ts

import mongoose, { Schema } from 'mongoose';
import { IRoleDocument } from './roleInterface';

const RoleSchema = new Schema<IRoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Role = mongoose.model<IRoleDocument>('Role', RoleSchema);
