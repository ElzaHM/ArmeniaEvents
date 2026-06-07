const DATE_FALLBACK = 'Date TBD';

export function parseEventDate(dateString?: string | null): Date | null {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getDateSortValue(dateString?: string | null): number {
  return parseEventDate(dateString)?.getTime() ?? 0;
}

export function formatEventTime(dateString?: string | null): string {
  const date = parseEventDate(dateString);
  if (!date) {
    return DATE_FALLBACK;
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateBadge(dateString?: string | null): { month: string; day: string } {
  const date = parseEventDate(dateString);
  if (!date) {
    return { month: 'TBD', day: '--' };
  }

  return {
    month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: String(date.getDate()),
  };
}

export function formatEventDateTime(dateString?: string | null, time?: string): string {
  const date = parseEventDate(dateString);
  if (!date) {
    return time && time !== DATE_FALLBACK ? time : DATE_FALLBACK;
  }

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = time && time !== DATE_FALLBACK ? time : formatEventTime(dateString);
  return `${formattedDate} • ${formattedTime}`;
}

export function formatFullDate(dateString?: string | null, time?: string): string {
  const date = parseEventDate(dateString);
  if (!date) {
    return time && time !== DATE_FALLBACK ? time : DATE_FALLBACK;
  }

  const formatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = time && time !== DATE_FALLBACK ? time : formatEventTime(dateString);
  return `${formatted} • ${formattedTime}`;
}

export function formatWeekday(dateString?: string | null): string {
  const date = parseEventDate(dateString);
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

function toGoogleCalendarUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

type GoogleCalendarEventParams = {
  title: string;
  startDate: string;
  endDate?: string | null;
  location?: string;
  description?: string[];
};

export function buildGoogleCalendarEventUrl(params: GoogleCalendarEventParams): string | null {
  const start = parseEventDate(params.startDate);
  if (!start) {
    return null;
  }

  const parsedEnd = params.endDate ? parseEventDate(params.endDate) : null;
  const end =
    parsedEnd && parsedEnd.getTime() > start.getTime()
      ? parsedEnd
      : new Date(start.getTime() + 60 * 60 * 1000);

  const searchParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: params.title,
    dates: `${toGoogleCalendarUtc(start)}/${toGoogleCalendarUtc(end)}`,
  });

  if (params.location) {
    searchParams.set('location', params.location);
  }

  const details = (params.description ?? []).filter(Boolean).join('\n\n');
  if (details) {
    searchParams.set('details', details);
  }

  return `https://calendar.google.com/calendar/render?${searchParams.toString()}`;
}

export function openGoogleCalendarEvent(params: GoogleCalendarEventParams): void {
  const url = buildGoogleCalendarEventUrl(params);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
