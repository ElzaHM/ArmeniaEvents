import { Router } from 'express';

import { adminUsersRoutes } from './users/admin-users.routes.js';

export const adminRoutes = Router();

adminRoutes.use('/users', adminUsersRoutes);
