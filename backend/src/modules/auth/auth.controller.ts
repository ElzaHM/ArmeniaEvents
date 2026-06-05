import type { NextFunction, Request, Response } from 'express';

import { loginSchema, registerSchema } from './auth.schema.js';
import * as authService from './auth.service.js';

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = registerSchema.parse(req.body);
    // eslint-disable-next-line no-console
    console.log(`[auth] register attempt: ${payload.email}`);
    const session = await authService.register(payload);
    // eslint-disable-next-line no-console
    console.log(`[auth] register ok: ${session.user.email}`);
    res.status(201).json(session);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    // eslint-disable-next-line no-console
    console.error(`[auth] register failed: ${message}`);
    next(error);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = loginSchema.parse(req.body);
    // eslint-disable-next-line no-console
    console.log(`[auth] login attempt: ${payload.email}`);
    const session = await authService.login(payload);
    // eslint-disable-next-line no-console
    console.log(`[auth] login ok: ${session.user.email}`);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

export function meController(req: Request, res: Response) {
  if (!req.authUser || !req.accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // eslint-disable-next-line no-console
  console.log(`[auth] session check (me): ${req.authUser.email}`);

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
