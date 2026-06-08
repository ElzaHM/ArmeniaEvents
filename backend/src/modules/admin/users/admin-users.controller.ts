import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import * as adminUsersService from './admin-users.service.js';

const idSchema = z.object({
  id: z.string().uuid(),
});

const updateAdminUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'inactive', 'pending']),
  avatar_url: z.string().trim().min(1),
});

export async function listAdminUsersController(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await adminUsersService.listAdminUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function updateAdminUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const payload = updateAdminUserSchema.parse(req.body);
    const user = await adminUsersService.updateAdminUser(id, payload);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    await adminUsersService.deleteAdminUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
