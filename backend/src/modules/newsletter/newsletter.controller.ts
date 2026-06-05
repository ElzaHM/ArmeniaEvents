import type { NextFunction, Request, Response } from 'express';

import { newsletterSubscribeSchema } from './newsletter.schema.js';
import * as newsletterService from './newsletter.service.js';

export async function subscribeController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = newsletterSubscribeSchema.parse(req.body);
    const result = await newsletterService.subscribeToNewsletter(email);

    if (result.status === 'duplicate') {
      return res.status(409).json({ message: "You're already subscribed." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
