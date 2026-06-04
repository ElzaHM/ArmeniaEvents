import type { NextFunction, Request, Response } from 'express';

import * as adminUsersService from './admin-users.service.js';

export async function listAdminUsersController(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await adminUsersService.listAdminUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
