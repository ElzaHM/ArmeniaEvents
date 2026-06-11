import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env'),
  quiet: true,
});

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
  TELEGRAM_BOT_TOKEN_TICKET: z.string().min(1).optional(),
  TELEGRAM_CHAT_ID: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid backend environment variables:\n${issues}`);
}

function pickEnv(primary?: string, fallback?: string): string | undefined {
  const value = (primary ?? fallback)?.trim();
  return value || undefined;
}

export const env = {
  ...parsed.data,
  TELEGRAM_BOT_TOKEN: pickEnv(parsed.data.TELEGRAM_BOT_TOKEN, process.env.VITE_TELEGRAM_BOT_TOKEN),
  TELEGRAM_BOT_TOKEN_TICKET: pickEnv(
    parsed.data.TELEGRAM_BOT_TOKEN_TICKET,
    process.env.VITE_TELEGRAM_BOT_TOKEN_TICKET,
  ),
  TELEGRAM_CHAT_ID: pickEnv(parsed.data.TELEGRAM_CHAT_ID, process.env.VITE_TELEGRAM_CHAT_ID),
};
