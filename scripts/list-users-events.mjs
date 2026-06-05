import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

config();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  realtime: {
    transport: ws,
  },
});

const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});

if (usersError) {
  console.error('Users error:', usersError.message);
  process.exit(1);
}

console.log('\n=== AUTH USERS ===');
for (const user of usersData.users) {
  console.log(`${user.email?.padEnd(32)} ${user.created_at?.slice(0, 10) ?? ''}`);
}

const { data: events, error: eventsError } = await supabase.from('events').select('id, title, start_date');

if (eventsError) {
  console.error('Events error:', eventsError.message);
  process.exit(1);
}

console.log('\n=== EVENTS ===');
for (const event of events ?? []) {
  console.log(`${event.id?.slice(0, 8)}...  ${event.title}`);
}
