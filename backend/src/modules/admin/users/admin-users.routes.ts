import { Router } from 'express';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import { listAdminUsersController } from './admin-users.controller.js';

export const adminUsersRoutes = Router();

adminUsersRoutes.get('/', requireAuth, listAdminUsersController);
