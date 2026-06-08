import { useEffect, useState } from 'react';

import { EventFilters, EventList, EventSearch } from '../../components/events';
import type { AppliedEventFilters } from '../../components/events/EventFilters';
import '../../components/home/home.css';
import '../../components/events/events.css';

import pageStyles from '../../components/events/EventsPage.module.css';

export default function EventsPage() {
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [appliedEventType, setAppliedEventType] = useState<string | null>(null);
  const [appliedLanguage, setAppliedLanguage] = useState<string | null>(null);
  const [appliedPriceRange, setAppliedPriceRange] = useState<'free' | 'paid' | null>(null);
  const [appliedOrganizer, setAppliedOrganizer] = useState<string | null>(null);
  const [appliedDateRange, setAppliedDateRange] = useState<{ from: string; to: string } | null>(
    null,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleApplyFilters = (filters: AppliedEventFilters) => {
    setAppliedCategories(filters.categories);
    setAppliedEventType(filters.eventType);
    setAppliedLanguage(filters.language);
    setAppliedPriceRange(filters.priceRange);
    setAppliedOrganizer(filters.organizer);
    setAppliedDateRange(filters.dateRange);
    setFiltersOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [filtersOpen]);

  return (
    <div className={`${pageStyles.eventsPage} eventsPage`}>
      <EventSearch />
      <div className={pageStyles.main}>
        {filtersOpen && (
          <button
            type="button"
            className={pageStyles.filtersBackdrop}
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
        )}
        <div
          className={`${pageStyles.sidebar} ${filtersOpen ? pageStyles.sidebarOpen : ''}`}
        >
          <EventFilters
            onApply={handleApplyFilters}
            onClose={() => setFiltersOpen(false)}
          />
        </div>
        <div className={pageStyles.content}>
          <EventList
            appliedCategories={appliedCategories}
            appliedEventType={appliedEventType}
            appliedLanguage={appliedLanguage}
            appliedPriceRange={appliedPriceRange}
            appliedOrganizer={appliedOrganizer}
            appliedDateRange={appliedDateRange}
            onOpenFilters={() => setFiltersOpen(true)}
          />
        </div>
      </div>
    </div>
  );
}
