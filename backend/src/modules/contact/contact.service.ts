import axios from 'axios';

import { env } from '../../config/env.js';
import type { ContactMessageInput } from './contact.schema.js';

export type SendContactMessageResult = {
  success: true;
};

function formatTelegramMessage(input: ContactMessageInput): string {
  const lines = [
    '📩 New contact message',
    '',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    '',
    `Message:`,
    input.message,
  ];

  return lines.join('\n');
}

export async function sendContactMessageToTelegram(
  input: ContactMessageInput,
): Promise<SendContactMessageResult> {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram messaging is not configured.');
  }

  const response = await axios.post<{ ok: boolean; description?: string }>(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: TELEGRAM_CHAT_ID,
      text: formatTelegramMessage(input),
    },
  );

  if (!response.data.ok) {
    throw new Error(response.data.description ?? 'Failed to send message via Telegram.');
  }

  return { success: true };
}
