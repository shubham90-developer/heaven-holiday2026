// src/modules/role/roleController.ts

import { NextFunction, Request, Response } from 'express';
import { Role } from './roleModel';
import { Admin } from '../admin/adminModel';
import { appError } from '../../errors/appError';
import {
  createRoleValidation,
  updateRoleValidation,
  createUserValidation,
  changeRoleValidation,
} from './roleValidation';

// ─── ROLE MANAGEMENT ──────────────────────────────────────────

// Create Role
export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createRoleValidation.parse(req.body);

    const roleExists = await Role.findOne({ name: validatedData.name });
    if (roleExists) {
      return next(new appError('Role already exists', 400));
    }

    const role = await Role.create({
      name: validatedData.name,
      permissions: validatedData.permissions,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Role created successfully',
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Roles
export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roles = await Role.find();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Roles retrieved successfully',
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

// Update Role Permissions
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = updateRoleValidation.parse(req.body);

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { permissions: validatedData.permissions },
      { new: true },
    );

    if (!role) {
      return next(new appError('Role not found', 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Role updated successfully',
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Role
export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // check if any user has this role
    const userWithRole = await Admin.findOne({ role: req.params.id });
    if (userWithRole) {
      return next(new appError('Cannot delete role assigned to a user', 400));
    }

    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return next(new appError('Role not found', 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Role deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── USER MANAGEMENT ──────────────────────────────────────────

// Create User (Super Admin creates login for someone)
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createUserValidation.parse(req.body);

    // check role exists
    const role = await Role.findById(validatedData.roleId);
    if (!role) {
      return next(new appError('Role not found', 404));
    }

    // check email already exists
    const userExists = await Admin.findOne({ email: validatedData.email });
    if (userExists) {
      return next(new appError('Email already in use', 400));
    }

    // save to Admin collection
    // existing pre-save hook auto hashes password ✅
    const user = await Admin.create({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
      role: validatedData.roleId,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User created successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: role.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users (everyone except super admin)
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await Admin.find({ role: { $ne: null } })
      .populate('role', 'name permissions')
      .select('-password');

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Change User Role
export const changeUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = changeRoleValidation.parse(req.body);

    const role = await Role.findById(validatedData.roleId);
    if (!role) {
      return next(new appError('Role not found', 404));
    }

    const user = await Admin.findByIdAndUpdate(
      req.params.id,
      { role: validatedData.roleId },
      { new: true },
    )
      .populate('role', 'name permissions')
      .select('-password');

    if (!user) {
      return next(new appError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete User
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // only delete users with a role (never delete super admin)
    const user = await Admin.findOneAndDelete({
      _id: req.params.id,
      role: { $ne: null },
    });

    if (!user) {
      return next(new appError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
