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
