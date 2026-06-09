import { Router } from 'express';

import { requireAdmin, requireAuth } from '../../../middleware/auth.middleware.js';
import {
  deleteAdminUserController,
  listAdminUsersController,
  updateAdminUserController,
} from './admin-users.controller.js';

export const adminUsersRoutes = Router();

adminUsersRoutes.get('/', requireAuth, requireAdmin, listAdminUsersController);
adminUsersRoutes.patch('/:id', requireAuth, requireAdmin, updateAdminUserController);
adminUsersRoutes.delete('/:id', requireAuth, requireAdmin, deleteAdminUserController);
