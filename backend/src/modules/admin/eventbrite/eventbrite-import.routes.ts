import { Router } from 'express';

import { requireAdmin, requireAuth } from '../../../middleware/auth.middleware.js';
import { importEventbriteController } from './eventbrite-import.controller.js';

export const eventbriteImportRoutes = Router();

eventbriteImportRoutes.post(
  '/events/import/eventbrite',
  requireAuth,
  requireAdmin,
  importEventbriteController,
);
