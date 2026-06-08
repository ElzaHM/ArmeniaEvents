import { Router } from 'express';

import { requireAuth } from '../../middleware/auth.middleware.js';
import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  registerController,
  resetPasswordController,
} from './auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.post('/forgot-password', forgotPasswordController);
authRoutes.post('/reset-password', resetPasswordController);
authRoutes.get('/me', requireAuth, meController);
authRoutes.post('/logout', logoutController);
