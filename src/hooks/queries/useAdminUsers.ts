import { useQuery } from '@tanstack/react-query';

import { adminUsersService } from '../../services/admin-users.service';

export const adminUsersKeys = {
  all: ['admin', 'users'] as const,
  count: ['admin', 'users', 'count'] as const,
};

export function useAdminUsers() {
  return useQuery({
    queryKey: adminUsersKeys.all,
    queryFn: () => adminUsersService.getUsers(),
  });
}

export function useAdminUsersCount() {
  return useQuery({
    queryKey: adminUsersKeys.count,
    queryFn: () => adminUsersService.getUsersCount(),
  });
}
