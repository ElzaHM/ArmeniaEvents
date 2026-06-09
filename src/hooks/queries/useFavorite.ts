import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';
import { favoritesService } from '../../services/favorites.service';
import { useAuth } from '../useAuth';

type FavoriteStatus = {
  favorited: boolean;
};

export const favoriteKeys = {
  list: ['favorites', 'user'] as const,
  events: ['favorites', 'user', 'events'] as const,
  status: (eventId: string | undefined) => ['event', eventId, 'favorite'] as const,
};

export function useUserFavoriteIds() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: favoriteKeys.list,
    queryFn: () => favoritesService.getUserFavoriteIds(),
    enabled: isAuthenticated,
  });
}

export function useUserFavoriteEvents() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: favoriteKeys.events,
    queryFn: () => favoritesService.getUserFavoriteEvents(),
    enabled: isAuthenticated,
  });
}

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
    onSuccess: (data) => {
      if (eventId) {
        queryClient.setQueryData(favoriteKeys.status(eventId), data);
        queryClient.setQueryData<string[]>(favoriteKeys.list, (current = []) => {
          if (data.favorited) {
            return current.includes(eventId) ? current : [...current, eventId];
          }

          return current.filter((id) => id !== eventId);
        });
      }

      void queryClient.invalidateQueries({ queryKey: favoriteKeys.list });
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.events });
      void queryClient.invalidateQueries({ queryKey: ['events'] });
      void queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.status(eventId) });
    },
  });
}
