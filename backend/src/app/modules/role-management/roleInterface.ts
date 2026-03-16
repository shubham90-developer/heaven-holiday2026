// src/modules/role/roleInterface.ts

import { Document, Types } from 'mongoose';

export interface IRole {
  name: string;
  permissions: string[];
}

export interface IRoleDocument extends IRole, Document {}

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  roleId: string;
}
