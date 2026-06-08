import { useQuery } from '@tanstack/react-query';

import { fetchAdminNotifications } from '../../services/admin-notifications.service';

export const adminNotificationsKey = ['admin', 'notifications'] as const;

export function useAdminNotifications() {
  return useQuery({
    queryKey: adminNotificationsKey,
    queryFn: fetchAdminNotifications,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
