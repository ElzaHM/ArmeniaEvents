import { Router } from 'express';

import { importEventbriteController } from './eventbrite-import.controller.js';

export const eventbriteImportRoutes = Router();

eventbriteImportRoutes.post('/events/import/eventbrite', importEventbriteController);
