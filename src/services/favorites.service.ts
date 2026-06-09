import type { EventDetails } from '../components/event-details/types';
import type { EventItem } from '../components/home/types';
import { api } from '../api/axios';
import { eventsService } from './events.service';

function mapEventDetailsToEventItem(event: EventDetails): EventItem {
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    location: event.location,
    date: event.date,
    time: event.time,
    price: event.price,
    isFree: event.isFree,
    imageUrl: event.imageUrl,
    startDate: event.date,
  };
}

export const favoritesService = {
  async getUserFavoriteIds(): Promise<string[]> {
    const { data } = await api.get<string[]>('/events/users/me/favorites');
    return data;
  },

  async getUserFavoriteEvents(): Promise<EventItem[]> {
    const ids = await this.getUserFavoriteIds();
    if (ids.length === 0) {
      return [];
    }

    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const event = await eventsService.getEventById(id);
          return mapEventDetailsToEventItem(event);
        } catch {
          return null;
        }
      }),
    );

    return results.filter((event): event is EventItem => event !== null);
  },
};
