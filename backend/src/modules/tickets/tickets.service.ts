import { supabaseAdminClient } from '../../lib/supabase.js';

export type ReserveTicketResult = {
  status: 'created';
  ticketCode: string;
  eventId: string;
};

const TICKET_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateTicketCode(): string {
  let suffix = '';
  for (let i = 0; i < 5; i += 1) {
    suffix += TICKET_CODE_CHARS[Math.floor(Math.random() * TICKET_CODE_CHARS.length)];
  }
  return `AE-${suffix}`;
}

export type EventTicketDetails = {
  id: string;
  title: string;
  start_date: string | null;
  address: string | null;
  venue: string | null;
  price: number | null;
};

export async function getEventTicketDetails(eventId: string): Promise<EventTicketDetails> {
  const { data, error } = await supabaseAdminClient
    .from('events')
    .select('id, title, start_date, address, venue, price')
    .eq('id', eventId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Event not found');
  }

  return data;
}

export async function reserveTicket(
  userId: string,
  eventId: string,
): Promise<ReserveTicketResult> {
  const { data: event, error: eventError } = await supabaseAdminClient
    .from('events')
    .select('id, price')
    .eq('id', eventId)
    .maybeSingle();

  if (eventError) {
    throw new Error(eventError.message);
  }

  if (!event) {
    throw new Error('Event not found');
  }

  const price = event.price ?? 0;

  if (price <= 0) {
    throw new Error('Event is not paid');
  }

  const { data: existing, error: lookupError } = await supabaseAdminClient
    .from('event_ticket_reservations')
    .select('ticket_code, status, event_id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existing) {
    return {
      status: 'created',
      ticketCode: existing.ticket_code,
      eventId: existing.event_id,
    };
  }

  const ticketCode = generateTicketCode();

  const { error: insertError } = await supabaseAdminClient
    .from('event_ticket_reservations')
    .insert({
      user_id: userId,
      event_id: eventId,
      ticket_code: ticketCode,
      price,
      status: 'reserved',
    });

  if (insertError) {
    if (insertError.code === '23505') {
      const { data: duplicateReservation } = await supabaseAdminClient
        .from('event_ticket_reservations')
        .select('ticket_code, event_id')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();

      if (duplicateReservation) {
        return {
          status: 'created',
          ticketCode: duplicateReservation.ticket_code,
          eventId: duplicateReservation.event_id,
        };
      }
    }

    throw new Error(insertError.message);
  }

  return {
    status: 'created',
    ticketCode,
    eventId,
  };
}