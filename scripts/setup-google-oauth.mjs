import { config } from 'dotenv';

config();

const projectRef = process.env.SUPABASE_PROJECT_REF ?? 'neqxqbfypgpefbqrzmmr';
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

if (!accessToken) {
  console.error('Missing SUPABASE_ACCESS_TOKEN in .env');
  console.error('Create one at: https://supabase.com/dashboard/account/tokens');
  process.exit(1);
}

if (!clientId || !clientSecret) {
  console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env');
  process.exit(1);
}

const authConfig = {
  external_google_enabled: true,
  external_google_client_id: clientId,
  external_google_secret: clientSecret,
  external_google_skip_nonce_check: false,
  site_url: clientOrigin,
  uri_allow_list: `${clientOrigin}/auth/callback`,
};

const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(authConfig),
});

const body = await response.text();
let parsed;
try {
  parsed = JSON.parse(body);
} catch {
  parsed = body;
}

if (!response.ok) {
  console.error('Failed to configure Google OAuth in Supabase.');
  console.error(`Status: ${response.status}`);
  console.error(parsed);
  process.exit(1);
}

console.log('Google OAuth configured in Supabase successfully.');
console.log(`Site URL: ${clientOrigin}`);
console.log(`Redirect URL: ${clientOrigin}/auth/callback`);
console.log('');
console.log('Make sure Google Cloud Console has this redirect URI:');
console.log(`https://${projectRef}.supabase.co/auth/v1/callback`);
