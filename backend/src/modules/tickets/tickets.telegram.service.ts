import axios from 'axios';

import { env } from '../../config/env.js';

export type TicketTelegramDetails = {
  ticketCode: string;
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  price: string;
  eventId: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendTicketPurchaseToTelegram(details: TicketTelegramDetails): Promise<void> {
  const botToken = env.TELEGRAM_BOT_TOKEN_TICKET;
  const chatId = env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('[tickets] Telegram ticket bot is not configured, skipping notification.');
    return;
  }

  const text = `
<b>New Ticket Purchase</b>

<b>Ticket Code:</b> ${escapeHtml(details.ticketCode)}
<b>Name:</b> ${escapeHtml(details.userName)}
<b>Email:</b> ${escapeHtml(details.userEmail)}
<b>Event:</b> ${escapeHtml(details.eventTitle)}
<b>Date:</b> ${escapeHtml(details.eventDate)}
<b>Venue:</b> ${escapeHtml(details.venue)}
<b>Price:</b> ${escapeHtml(details.price)}
<b>Event ID:</b> ${escapeHtml(details.eventId)}
`.trim();

  const response = await axios.post<{ ok: boolean; description?: string }>(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    },
  );

  if (!response.data.ok) {
    throw new Error(response.data.description ?? 'Failed to send ticket notification via Telegram.');
  }
}
