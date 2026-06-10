import { useMutation } from '@tanstack/react-query';

import type { ReserveTicketPayload } from '../../services/tickets.service';
import { ticketsService } from '../../services/tickets.service';

export const ticketKeys = {
  all: ['tickets'] as const,
  reserve: ['tickets', 'reserve'] as const,
};

export function useReserveTicket() {
  return useMutation({
    mutationKey: ticketKeys.reserve,
    mutationFn: (payload: ReserveTicketPayload) => ticketsService.reserveTicket(payload),
  });
}
