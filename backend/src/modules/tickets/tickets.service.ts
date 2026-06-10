import { supabaseAdminClient } from '../../lib/supabase.js';

export type ReserveTicketResult =
  | { status: 'created'; ticketCode: string; eventId: string }
  | { status: 'duplicate' };

const TICKET_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateTicketCode(): string {
  let suffix = '';
  for (let i = 0; i < 5; i += 1) {
    suffix += TICKET_CODE_CHARS[Math.floor(Math.random() * TICKET_CODE_CHARS.length)];
  }
  return `AE-${suffix}`;
}

export async function reserveTicket(userId: string, eventId: string): Promise<ReserveTicketResult> {
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
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existing) {
    return { status: 'duplicate' };
  }

  const ticketCode = generateTicketCode();

  const { error: insertError } = await supabaseAdminClient.from('event_ticket_reservations').insert({
    user_id: userId,
    event_id: eventId,
    ticket_code: ticketCode,
    price,
    status: 'reserved',
  });

  if (insertError) {
    if (insertError.code === '23505') {
      return { status: 'duplicate' };
    }
    throw new Error(insertError.message);
  }

  return { status: 'created', ticketCode, eventId };
}
