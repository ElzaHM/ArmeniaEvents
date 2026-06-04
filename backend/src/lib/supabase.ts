import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

import { env } from '../config/env.js';

const realtimeConfig = {
  realtime: {
    transport: ws as unknown as never,
  },
};

export const supabaseAuthClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, realtimeConfig);

export const supabaseAdminClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  realtimeConfig,
);
