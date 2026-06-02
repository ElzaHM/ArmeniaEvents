import type { NextFunction, Request, Response } from 'express';

import { loginSchema, registerSchema } from './auth.schema.js';
import * as authService from './auth.service.js';

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = registerSchema.parse(req.body);
    const session = await authService.register(payload);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = loginSchema.parse(req.body);
    const session = await authService.login(payload);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

export function meController(req: Request, res: Response) {
  if (!req.authUser || !req.accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(200).json({
    user: req.authUser,
    accessToken: req.accessToken,
    refreshToken: null,
    expiresAt: null,
  });
}

export function logoutController(_req: Request, res: Response) {
  return res.status(200).json({ success: true });
}
