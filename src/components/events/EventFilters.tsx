import { useState } from 'react';
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  Slider,
  Typography,
} from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';

import {
  EVENT_TYPES,
  FILTER_CATEGORIES,
  LANGUAGES,
  ORGANIZERS,
  PRICE_MARKS,
  RADIUS_MARKS,
} from './mockData';

import styles from './EventFilters.module.css';

const initialCategories = FILTER_CATEGORIES.map((category) => category.name);
const initialEventTypes = EVENT_TYPES.map((type) => type.label);
const initialLanguages = LANGUAGES.map((language) => language.label);
const initialOrganizers = ORGANIZERS.slice(0, 3).map((organizer) => organizer.name);

const datePickerStyles = {
  input: {
    color: 'var(--home-input-text)',
  },
  placeholder: {
    color: 'var(--events-date-placeholder)',
  },
};

const selectFieldStyles = {
  selector: {
    background: 'var(--events-field-light-bg)',
    borderColor: 'var(--events-field-border)',
    color: 'var(--home-text)',
  },
};

const categoryOptions = FILTER_CATEGORIES.map((category) => ({
  value: category.name,
  label: category.name,
}));

const eventTypeOptions = EVENT_TYPES.map((type) => ({
  value: type.label,
  label: type.label,
}));

const languageOptions = LANGUAGES.map((language) => ({
  value: language.label,
  label: language.label,
}));

const organizerOptions = ORGANIZERS.map((organizer) => ({
  value: organizer.name,
  label: organizer.name,
}));

const priceOptions = Object.entries(PRICE_MARKS).map(([value, label]) => ({
  value: Number(value),
  label,
}));

const radiusOptions = Object.entries(RADIUS_MARKS).map(([value, label]) => ({
  value: Number(value),
  label,
}));

const filterSelectProps = {
  className: 'eventsSortField',
  popupClassName: 'eventsFieldDropdown' as const,
  suffixIcon: <DownOutlined />,
  styles: selectFieldStyles,
  maxTagCount: 'responsive' as const,
};

export default function EventFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(initialEventTypes);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(initialLanguages);
  const [selectedOrganizers, setSelectedOrganizers] = useState<string[]>(initialOrganizers);
  const [priceRange, setPriceRange] = useState(50);
  const [locationRadius, setLocationRadius] = useState(25);
  const [organizerQuery, setOrganizerQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories
    ? FILTER_CATEGORIES
    : FILTER_CATEGORIES.slice(0, 5);

  const filteredOrganizers = ORGANIZERS.filter((organizer) =>
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
    <aside className={`${styles.filters} eventsFilters`}>
      <div className={styles.header}>
        <Typography.Title level={5} className={styles.title}>
          Filters
        </Typography.Title>
        <button type="button" className={styles.clearAll} onClick={handleReset}>
          Clear All
        </button>
      </div>

      <div className={styles.desktopFilters}>
        <div className={styles.group}>
          <Typography.Text strong className={styles.groupTitle}>
            Date
          </Typography.Text>
          <div className={styles.dateFields}>
            <DatePicker
              placeholder="From Date"
              className={`${styles.datePicker} eventsDateField`}
              popupClassName="eventsFieldDropdown"
              styles={datePickerStyles}
            />
            <DatePicker
              placeholder="To Date"
              className={`${styles.datePicker} eventsDateField`}
              popupClassName="eventsFieldDropdown"
              styles={datePickerStyles}
            />
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
          {!showAllCategories && FILTER_CATEGORIES.length > 5 && (
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
            {EVENT_TYPES.map((type) => (
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
            marks={PRICE_MARKS}
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
            {LANGUAGES.map((language) => (
              <Checkbox key={language.label} value={language.label} className={styles.checkboxRow}>
                <span className={styles.checkboxLabel}>{language.label}</span>
                <span className={styles.count}>{language.count}</span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        <div className={`${styles.group} ${styles.organizerGroup}`}>
          <Typography.Text strong className={styles.groupTitle}>
            Organizer
          </Typography.Text>
          <Input
            placeholder="Search organizers..."
            prefix={<SearchOutlined />}
            value={organizerQuery}
            onChange={(event) => setOrganizerQuery(event.target.value)}
            className={`${styles.organizerSearch} eventsOrganizerField`}
          />
          <Checkbox.Group
            value={selectedOrganizers}
            onChange={(values) => setSelectedOrganizers(values as string[])}
            className={`${styles.checkboxGroup} ${styles.organizerList}`}
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
            marks={RADIUS_MARKS}
            className={styles.slider}
          />
        </div>
      </div>

      <div className={styles.mobileFilters}>
        <div className={styles.mobileGrid}>
          <div className={`${styles.mobileField} ${styles.mobileFieldFull}`}>
            <Typography.Text className={styles.mobileLabel}>Date</Typography.Text>
            <div className={styles.dateFieldsRow}>
              <DatePicker
                placeholder="From Date"
                className={`${styles.datePicker} eventsDateField`}
                popupClassName="eventsFieldDropdown"
                styles={datePickerStyles}
              />
              <DatePicker
                placeholder="To Date"
                className={`${styles.datePicker} eventsDateField`}
                popupClassName="eventsFieldDropdown"
                styles={datePickerStyles}
              />
            </div>
          </div>

          <div className={styles.mobileField}>
            <Typography.Text className={styles.mobileLabel}>Categories</Typography.Text>
            <Select
              mode="multiple"
              allowClear
              placeholder="Categories"
              value={selectedCategories}
              onChange={setSelectedCategories}
              options={categoryOptions}
              {...filterSelectProps}
            />
          </div>

          <div className={styles.mobileField}>
            <Typography.Text className={styles.mobileLabel}>Event Type</Typography.Text>
            <Select
              mode="multiple"
              allowClear
              placeholder="Event type"
              value={selectedEventTypes}
              onChange={setSelectedEventTypes}
              options={eventTypeOptions}
              {...filterSelectProps}
            />
          </div>

          <div className={styles.mobileField}>
            <Typography.Text className={styles.mobileLabel}>Language</Typography.Text>
            <Select
              mode="multiple"
              allowClear
              placeholder="Language"
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              options={languageOptions}
              {...filterSelectProps}
            />
          </div>

          <div className={styles.mobileField}>
            <Typography.Text className={styles.mobileLabel}>Organizer</Typography.Text>
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Organizer"
              value={selectedOrganizers}
              onChange={setSelectedOrganizers}
              options={organizerOptions}
              optionFilterProp="label"
              {...filterSelectProps}
            />
          </div>

          <div className={styles.mobileField}>
            <Typography.Text className={styles.mobileLabel}>Price Range</Typography.Text>
            <Select
              placeholder="Price range"
              value={priceRange}
              onChange={setPriceRange}
              options={priceOptions}
              {...filterSelectProps}
            />
          </div>

          <div className={styles.mobileField}>
            <Typography.Text className={styles.mobileLabel}>Location Radius</Typography.Text>
            <Select
              placeholder="Radius"
              value={locationRadius}
              onChange={setLocationRadius}
              options={radiusOptions}
              {...filterSelectProps}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="primary" block size="large" className={`homeActionBtn ${styles.applyBtn}`}>
          Apply Filters
        </Button>
        <Button type="text" block className={styles.resetBtn} onClick={handleReset}>
          Reset All
        </Button>
      </div>
    </aside>
  );
}
