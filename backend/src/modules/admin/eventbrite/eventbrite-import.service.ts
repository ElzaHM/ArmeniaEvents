import axios from 'axios';

import { supabaseAdminClient } from '../../../lib/supabase.js';

type EventbriteTextField = {
  text?: string;
};

type EventbriteVenue = {
  name?: string;
  address?: {
    localized_address_display?: string;
  };
};

type EventbriteEvent = {
  id: string;
  name?: EventbriteTextField;
  description?: EventbriteTextField;
  start?: { utc?: string };
  end?: { utc?: string };
  logo?: { url?: string };
  venue?: EventbriteVenue;
  url?: string;
};

type EventbriteSearchResponse = {
  events?: EventbriteEvent[];
};

type EventInsertRow = {
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  venue: string | null;
  address: string | null;
  ticket_url: string | null;
  status: 'published';
  source: 'eventbrite';
  external_id: string;
};

function mapEventbriteEvent(event: EventbriteEvent): EventInsertRow | null {
  const title = event.name?.text?.trim();
  const startDate = event.start?.utc;

  if (!title || !startDate) {
    return null;
  }

  return {
    title,
    description: event.description?.text ?? null,
    start_date: startDate,
    end_date: event.end?.utc ?? null,
    image_url: event.logo?.url ?? null,
    venue: event.venue?.name ?? null,
    address: event.venue?.address?.localized_address_display ?? null,
    ticket_url: event.url ?? null,
    status: 'published',
    source: 'eventbrite',
    external_id: event.id,
  };
}

async function fetchEventbriteEvents(token: string): Promise<EventbriteEvent[]> {
  const { data } = await axios.get<EventbriteSearchResponse>(
    'https://www.eventbriteapi.com/v3/events/search/',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        'location.address': 'Yerevan, Armenia',
        'location.within': '50km',
        expand: 'venue,organizer,ticket_availability',
        page_size: 50,
      },
    },
  );

  return data.events ?? [];
}

async function eventbriteEventExists(externalId: string): Promise<boolean> {
  const { data, error } = await supabaseAdminClient
    .from('events')
    .select('id')
    .eq('external_id', externalId)
    .eq('source', 'eventbrite')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export async function importEventbriteEvents(): Promise<{ imported: number; skipped: number }> {
  const token = process.env.EVENTBRITE_API_TOKEN;

  if (!token) {
    throw new Error('EVENTBRITE_API_TOKEN is not configured');
  }

  const eventbriteEvents = await fetchEventbriteEvents(token);
  let imported = 0;
  let skipped = 0;

  for (const eventbriteEvent of eventbriteEvents) {
    const row = mapEventbriteEvent(eventbriteEvent);

    if (!row) {
      skipped += 1;
      continue;
    }

    const exists = await eventbriteEventExists(row.external_id);

    if (exists) {
      skipped += 1;
      continue;
    }

    const { error } = await supabaseAdminClient.from('events').insert(row);

    if (error) {
      throw new Error(error.message);
    }

    imported += 1;
  }

  return { imported, skipped };
}
