import type { NextFunction, Request, Response } from 'express';

import { contactMessageSchema } from './contact.schema.js';
import * as contactService from './contact.service.js';

export async function sendContactMessageController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = contactMessageSchema.parse(req.body);
    const result = await contactService.sendContactMessageToTelegram(input);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
