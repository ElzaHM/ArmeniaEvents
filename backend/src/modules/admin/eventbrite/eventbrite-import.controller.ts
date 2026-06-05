import type { NextFunction, Request, Response } from 'express';

import * as eventbriteImportService from './eventbrite-import.service.js';

export async function importEventbriteController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await eventbriteImportService.importEventbriteEvents();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
