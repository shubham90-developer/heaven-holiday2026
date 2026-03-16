import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../../config/firebase';

export interface AuthRequest extends Request {
  user?: { firebaseUid: string; email?: string };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await firebaseAuth.verifyIdToken(token);
    req.user = { firebaseUid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
