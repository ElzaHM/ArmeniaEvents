import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { eventCreateSchema, eventUpdateSchema } from './events.schema.js';
import * as eventsService from './events.service.js';

const idSchema = z.object({ id: z.string().uuid() });

export async function listEventsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eventsService.listEvents();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
}

export async function getEventController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const event = await eventsService.getEventById(id);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
}

export async function createEventController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = eventCreateSchema.parse(req.body);
    const event = await eventsService.createEvent(payload);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
}

export async function updateEventController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const payload = eventUpdateSchema.parse(req.body);
    const event = await eventsService.updateEvent(id, payload);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
}

export async function deleteEventController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    await eventsService.deleteEvent(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
