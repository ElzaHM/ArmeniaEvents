import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { requireAuth } from '../../../middleware/auth.middleware.js';
import { importEventbriteController } from './eventbrite-import.controller.js';

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.authUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
}

export const eventbriteImportRoutes = Router();

eventbriteImportRoutes.post(
  '/events/import/eventbrite',
  requireAuth,
  requireAdmin,
  importEventbriteController,
);
