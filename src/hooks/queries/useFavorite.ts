import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';
import { useAuth } from '../useAuth';

type FavoriteStatus = {
  favorited: boolean;
};

const favoriteKeys = {
  status: (eventId: string | undefined) => ['event', eventId, 'favorite'] as const,
};

export function useFavoriteStatus(eventId: string | undefined) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: favoriteKeys.status(eventId),
    queryFn: async () => {
      const { data } = await api.get<FavoriteStatus>(`/events/${eventId}/favorite`);
      return data;
    },
    enabled: Boolean(eventId && isAuthenticated),
  });
}

export function useToggleFavorite(eventId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const current = queryClient.getQueryData<FavoriteStatus>(favoriteKeys.status(eventId));
      const isFavorited = current?.favorited ?? false;

      if (isFavorited) {
        const { data } = await api.delete<FavoriteStatus>(`/events/${eventId}/favorite`);
        return data;
      }

      const { data } = await api.post<FavoriteStatus>(`/events/${eventId}/favorite`);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events'] });
      void queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.status(eventId) });
    },
  });
}
