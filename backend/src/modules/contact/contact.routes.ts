import { Router } from 'express';

import { sendContactMessageController } from './contact.controller.js';

export const contactRoutes = Router();

contactRoutes.post('/send', sendContactMessageController);
