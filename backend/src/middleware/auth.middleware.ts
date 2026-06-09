import type { NextFunction, Request, Response } from 'express';

import { isAdminRole } from '../lib/user-roles.js';
import { getUserFromToken } from '../modules/auth/auth.service.js';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        email: string;
        fullName: string;
        role: string;
      };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.authUser = user;
  req.accessToken = token;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.authUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!isAdminRole(req.authUser.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
}
