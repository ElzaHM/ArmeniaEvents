import { Router } from 'express';

import { requireAuth } from '../../middleware/auth.middleware.js';
import {
  createEventController,
  deleteEventController,
  getEventController,
  listEventsController,
  updateEventController,
} from './events.controller.js';

export const eventsRoutes = Router();

eventsRoutes.get('/', listEventsController);
eventsRoutes.get('/:id', getEventController);
eventsRoutes.post('/', requireAuth, createEventController);
eventsRoutes.patch('/:id', requireAuth, updateEventController);
eventsRoutes.delete('/:id', requireAuth, deleteEventController);
