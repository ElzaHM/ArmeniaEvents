import { Router } from 'express';

import { listAdminUsersController } from './admin-users.controller.js';

export const adminUsersRoutes = Router();

adminUsersRoutes.get('/', listAdminUsersController);
