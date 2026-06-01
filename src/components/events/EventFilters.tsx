import { useLayoutEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Slider,
  Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useEventFilters } from '../../hooks/queries/useEvents';

import styles from './EventFilters.module.css';

export default function EventFilters() {
  const { data: filters, isLoading, isError, error } = useEventFilters();
  const initializedRef = useRef(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(50);
  const [locationRadius, setLocationRadius] = useState(25);
  const [organizerQuery, setOrganizerQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  useLayoutEffect(() => {
    if (!filters || initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    setSelectedCategories(filters.filterCategories.map((category) => category.name));
    setSelectedEventTypes(filters.eventTypes.map((type) => type.label));
    setSelectedLanguages(filters.languages.map((language) => language.label));
    setSelectedOrganizers(filters.organizers.slice(0, 3).map((organizer) => organizer.name));
  }, [filters]);

  if (!filters) {
    return (
      <QueryState isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryState>
    );
  }

  const { filterCategories, eventTypes, languages, organizers, priceMarks, radiusMarks } =
    filters;

  const visibleCategories = showAllCategories
    ? filterCategories
    : filterCategories.slice(0, 5);

  const filteredOrganizers = organizers.filter((organizer) =>
    organizer.name.toLowerCase().includes(organizerQuery.toLowerCase()),
  );

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedEventTypes([]);
    setSelectedLanguages([]);
    setSelectedOrganizers([]);
    setPriceRange(0);
    setLocationRadius(5);
    setOrganizerQuery('');
    setShowAllCategories(false);
  };

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <aside className={styles.filters}>
        <div className={styles.header}>
          <Typography.Title level={5} className={styles.title}>
            Filters
          </Typography.Title>
          <button type="button" className={styles.clearAll} onClick={handleReset}>
            Clear All
          </button>
        </div>

        <div className={styles.group}>
          <Typography.Text strong className={styles.groupTitle}>
            Date
          </Typography.Text>
          <div className={styles.dateFields}>
            <DatePicker placeholder="From Date" className={styles.datePicker} />
            <DatePicker placeholder="To Date" className={styles.datePicker} />
          </div>
        </div>

        <div className={styles.group}>
          <Typography.Text strong className={styles.groupTitle}>
            Categories
          </Typography.Text>
          <Checkbox.Group
            value={selectedCategories}
            onChange={(values) => setSelectedCategories(values as string[])}
            className={styles.checkboxGroup}
          >
            {visibleCategories.map((category) => (
              <Checkbox key={category.name} value={category.name} className={styles.checkboxRow}>
                <span className={styles.checkboxLabel}>{category.name}</span>
                <span className={styles.count}>{category.count}</span>
              </Checkbox>
            ))}
          </Checkbox.Group>
          {!showAllCategories && filterCategories.length > 5 && (
            <button
              type="button"
              className={styles.showMore}
              onClick={() => setShowAllCategories(true)}
            >
              Show More
            </button>
          )}
        </div>

        <div className={styles.group}>
          <Typography.Text strong className={styles.groupTitle}>
            Event Type
          </Typography.Text>
          <Checkbox.Group
            value={selectedEventTypes}
            onChange={(values) => setSelectedEventTypes(values as string[])}
            className={styles.checkboxGroup}
          >
            {eventTypes.map((type) => (
              <Checkbox key={type.label} value={type.label} className={styles.checkboxRow}>
                <span className={styles.checkboxLabel}>{type.label}</span>
                <span className={styles.count}>{type.count}</span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        <div className={styles.group}>
          <Typography.Text strong className={styles.groupTitle}>
            Price Range
          </Typography.Text>
          <Slider
            min={0}
            max={100}
            value={priceRange}
            onChange={setPriceRange}
            marks={priceMarks}
            className={styles.slider}
          />
        </div>

        <div className={styles.group}>
          <Typography.Text strong className={styles.groupTitle}>
            Language
          </Typography.Text>
          <Checkbox.Group
            value={selectedLanguages}
            onChange={(values) => setSelectedLanguages(values as string[])}
            className={styles.checkboxGroup}
          >
            {languages.map((language) => (
              <Checkbox key={language.label} value={language.label} className={styles.checkboxRow}>
                <span className={styles.checkboxLabel}>{language.label}</span>
                <span className={styles.count}>{language.count}</span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        <div className={styles.group}>
          <Typography.Text strong className={styles.groupTitle}>
            Organizer
          </Typography.Text>
          <Input
            placeholder="Search organizers..."
            prefix={<SearchOutlined />}
            value={organizerQuery}
            onChange={(event) => setOrganizerQuery(event.target.value)}
            className={styles.organizerSearch}
          />
          <Checkbox.Group
            value={selectedOrganizers}
            onChange={(values) => setSelectedOrganizers(values as string[])}
            className={styles.checkboxGroup}
          >
            {filteredOrganizers.map((organizer) => (
              <Checkbox key={organizer.name} value={organizer.name} className={styles.checkboxRow}>
                <span className={styles.checkboxLabel}>{organizer.name}</span>
                <span className={styles.count}>{organizer.count}</span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        <div className={styles.group}>
          <Typography.Text strong className={styles.groupTitle}>
            Location Radius
          </Typography.Text>
          <Slider
            min={5}
            max={100}
            step={null}
            value={locationRadius}
            onChange={setLocationRadius}
            marks={radiusMarks}
            className={styles.slider}
          />
        </div>

        <div className={styles.actions}>
          <Button type="primary" block size="large" className={styles.applyBtn}>
            Apply Filters
          </Button>
          <Button type="text" block className={styles.resetBtn} onClick={handleReset}>
            Reset All
          </Button>
        </div>
      </aside>
    </QueryState>
  );
}
