import { Router } from 'express';

import { requireAuth } from '../../middleware/auth.middleware.js';
import {
  loginController,
  logoutController,
  meController,
  registerController,
} from './auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.get('/me', requireAuth, meController);
authRoutes.post('/logout', logoutController);
