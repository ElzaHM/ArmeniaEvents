import type { NextFunction, Request, Response } from 'express';

import { reserveTicketSchema } from './tickets.schema.js';
import * as ticketsService from './tickets.service.js';

export async function reserveTicketController(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = reserveTicketSchema.parse(req.body);
    const userId = req.authUser!.id;
    const result = await ticketsService.reserveTicket(userId, eventId);

    if (result.status === 'duplicate') {
      return res.status(409).json({ message: 'Ticket already reserved for this event.' });
    }

    return res.status(201).json({
      ticketCode: result.ticketCode,
      status: 'reserved',
      eventId: result.eventId,
    });
  } catch (error) {
    next(error);
  }
}
