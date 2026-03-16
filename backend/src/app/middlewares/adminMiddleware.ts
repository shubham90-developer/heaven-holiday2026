import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { appError } from '../errors/appError';
import { IAdminPayload } from '../modules/admin/adminInterface';

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(new appError('No token provided', 401));
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as IAdminPayload;

    (req as any).admin = decoded;
    next();
  } catch (error) {
    next(new appError('Invalid or expired token', 401));
  }
};
