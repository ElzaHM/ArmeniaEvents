import { supabase } from '../lib/supabase';
import { adminUsersService } from './admin-users.service';

export type AdminNotificationItem =
  | {
      type: 'user';
      id: string;
      name: string;
      email: string;
    }
  | {
      type: 'event';
      id: string;
      title: string;
    };

type DraftEventRow = {
  id: string;
  title: string;
};

export async function fetchAdminNotifications(): Promise<AdminNotificationItem[]> {
  const [users, eventsResult] = await Promise.all([
    adminUsersService.getUsers(),
    supabase.from('events').select('id, title').eq('status', 'draft'),
  ]);

  if (eventsResult.error) {
    throw new Error(eventsResult.error.message);
  }

  const pendingUsers: AdminNotificationItem[] = users
    .filter((user) => user.status === 'pending')
    .map((user) => ({
      type: 'user',
      id: user.id,
      name: user.name,
      email: user.email,
    }));

  const draftEvents: AdminNotificationItem[] = ((eventsResult.data ?? []) as DraftEventRow[]).map(
    (event) => ({
      type: 'event',
      id: event.id,
      title: event.title,
    }),
  );

  return [...pendingUsers, ...draftEvents];
}
