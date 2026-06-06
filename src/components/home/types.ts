export type CategoryIconName =
  | 'code'
  | 'briefcase'
  | 'rocket'
  | 'music'
  | 'palette'
  | 'camera'
  | 'bulb';

export interface Category {
  id: string;
  name: string;
  icon: CategoryIconName;
  eventCount: number;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  time: string;
  price: string;
  isFree: boolean;
  imageUrl: string;
  views?: number;
  status?: 'published' | 'draft' | 'archived';
  /** Raw ISO start date — used for sorting and admin edit payloads */
  startDate?: string;
}
