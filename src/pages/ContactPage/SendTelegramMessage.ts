import axios from 'axios';

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const sendTelegramMessage = async (name: string, email: string, message: string) => {
  const text = `
    <b>New Message from Portfolio</b>\n
    <b>👤 Name:</b> ${name}
    <b>📧 Email:</b> ${email}
    <b>📝 Message:</b> ${message}
    `;

  return axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: 'HTML',
  });
};
