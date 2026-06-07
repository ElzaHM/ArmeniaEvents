import { supabaseAdminClient } from '../../../lib/supabase.js';

export async function addFavorite(userId: string, eventId: string) {
  const { error: insertError } = await supabaseAdminClient
    .from('event_favorites')
    .insert({ user_id: userId, event_id: eventId });

  if (insertError) {
    throw new Error(insertError.message);
  }

  const { data: event, error: fetchError } = await supabaseAdminClient
    .from('events')
    .select('interested_count')
    .eq('id', eventId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const { error: updateError } = await supabaseAdminClient
    .from('events')
    .update({ interested_count: (event.interested_count ?? 0) + 1 })
    .eq('id', eventId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { favorited: true };
}

export async function removeFavorite(userId: string, eventId: string) {
  const { data, error: deleteError } = await supabaseAdminClient
    .from('event_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .select('event_id');

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (data && data.length > 0) {
    const { data: event, error: fetchError } = await supabaseAdminClient
      .from('events')
      .select('interested_count')
      .eq('id', eventId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const { error: updateError } = await supabaseAdminClient
      .from('events')
      .update({ interested_count: Math.max(0, (event.interested_count ?? 0) - 1) })
      .eq('id', eventId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  return { favorited: false };
}

export async function getFavoriteStatus(userId: string, eventId: string) {
  const { data, error } = await supabaseAdminClient
    .from('event_favorites')
    .select('event_id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return { favorited: Boolean(data) };
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabaseAdminClient
    .from('event_favorites')
    .select('event_id')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => row.event_id as string);
}
