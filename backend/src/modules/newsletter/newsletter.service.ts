import { supabaseAdminClient } from '../../lib/supabase.js';

export type NewsletterSubscribeResult =
  | { status: 'created' }
  | { status: 'duplicate' };

export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscribeResult> {
  const { data: existing, error: lookupError } = await supabaseAdminClient
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existing) {
    return { status: 'duplicate' };
  }

  const { error: insertError } = await supabaseAdminClient
    .from('newsletter_subscribers')
    .insert({ email });

  if (insertError) {
    if (insertError.code === '23505') {
      return { status: 'duplicate' };
    }
    throw new Error(insertError.message);
  }

  return { status: 'created' };
}
