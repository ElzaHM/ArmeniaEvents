import axios from 'axios';

import { api } from '../api/axios';

export type ReserveTicketPayload = {
  eventId: string;
};

export type TicketReservation = {
  ticketCode: string;
  status: string;
  eventId: string;
};

function toTicketsError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      'Ticket reservation failed. Please try again.';
    return new Error(message);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Unexpected error');
}

export const ticketsService = {
  async reserveTicket(payload: ReserveTicketPayload): Promise<TicketReservation> {
    try {
      const { data } = await api.post<TicketReservation>('/tickets/reserve', payload);
      return data;
    } catch (error) {
      throw toTicketsError(error);
    }
  },
};
