import { z } from 'zod';

export const reserveTicketSchema = z.object({
  eventId: z.string().uuid(),
});

export type ReserveTicketInput = z.infer<typeof reserveTicketSchema>;
