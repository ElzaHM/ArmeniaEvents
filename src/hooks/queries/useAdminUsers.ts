import { useQuery } from '@tanstack/react-query';

import { adminUsersService } from '../../services/admin-users.service';

export const adminUsersKeys = {
  all: ['admin', 'users'] as const,
};

export function useAdminUsers() {
  return useQuery({
    queryKey: adminUsersKeys.all,
    queryFn: () => adminUsersService.getUsers(),
  });
}
