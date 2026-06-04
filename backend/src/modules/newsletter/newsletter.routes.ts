import { Router } from 'express';

import { subscribeController } from './newsletter.controller.js';

export const newsletterRoutes = Router();

newsletterRoutes.post('/subscribe', subscribeController);
