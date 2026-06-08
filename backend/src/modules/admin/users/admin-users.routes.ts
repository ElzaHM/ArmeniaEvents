import { Router } from 'express';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import {
  deleteAdminUserController,
  listAdminUsersController,
  updateAdminUserController,
} from './admin-users.controller.js';

export const adminUsersRoutes = Router();

adminUsersRoutes.get('/', requireAuth, listAdminUsersController);
adminUsersRoutes.patch('/:id', requireAuth, updateAdminUserController);
adminUsersRoutes.delete('/:id', requireAuth, deleteAdminUserController);
