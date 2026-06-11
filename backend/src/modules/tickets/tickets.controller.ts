import type { NextFunction, Request, Response } from 'express';

import { reserveTicketSchema } from './tickets.schema.js';
import * as ticketsService from './tickets.service.js';
import { sendTicketPurchaseToTelegram } from './tickets.telegram.service.js';

function formatEventDate(startDate?: string | null): string {
  if (!startDate) {
    return 'TBD';
  }

  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) {
    return 'TBD';
  }

  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: number | null | undefined): string {
  if (price == null || price <= 0) {
    return 'Free';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export async function reserveTicketController(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = reserveTicketSchema.parse(req.body);
    const user = req.authUser!;
    const result = await ticketsService.reserveTicket(user.id, eventId);

    if (result.status === 'duplicate') {
      return res.status(409).json({ message: 'Ticket already reserved for this event.' });
    }

    try {
      const event = await ticketsService.getEventTicketDetails(eventId);

      await sendTicketPurchaseToTelegram({
        ticketCode: result.ticketCode,
        userEmail: user.email,
        userName: user.fullName || user.email,
        eventTitle: event.title,
        eventDate: formatEventDate(event.start_date),
        venue: event.venue || event.address || 'TBD',
        price: formatPrice(event.price),
        eventId: event.id,
      });
    } catch (telegramError) {
      console.error('[tickets] Failed to send Telegram notification:', telegramError);
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
