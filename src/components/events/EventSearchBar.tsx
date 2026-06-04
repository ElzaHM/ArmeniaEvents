import { useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useLocations } from '../../hooks/queries/useEvents';

import styles from './EventSearchBar.module.css';

export default function EventSearchBar() {
  const { data: locations, isLoading, isError, error } = useLocations();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('yerevan');

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error} minHeight={56}>
      {locations && (
        <div className={styles.searchBar}>
          <Space.Compact className={styles.compact} block>
            <Input
              size="large"
              placeholder="Search events, categories, or keywords..."
              prefix={<SearchOutlined />}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={styles.searchInput}
            />
            <Select
              size="large"
              value={location}
              onChange={setLocation}
              options={locations}
              suffixIcon={<EnvironmentOutlined />}
              className={styles.locationSelect}
            />
            <Button type="primary" size="large" className={styles.searchBtn}>
              Search
            </Button>
          </Space.Compact>
        </div>
      )}
    </QueryState>
  );
}
