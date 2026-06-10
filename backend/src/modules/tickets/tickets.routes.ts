import { Router } from 'express';

import { requireAuth } from '../../middleware/auth.middleware.js';
import { reserveTicketController } from './tickets.controller.js';

export const ticketsRoutes = Router();

ticketsRoutes.post('/reserve', requireAuth, reserveTicketController);
