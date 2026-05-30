import { useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';

import { LOCATIONS } from '../home/mockData';

import styles from './EventSearchBar.module.css';

export default function EventSearchBar() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('yerevan');

  return (
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
          options={LOCATIONS}
          suffixIcon={<EnvironmentOutlined />}
          className={styles.locationSelect}
        />
        <Button type="primary" size="large" className={styles.searchBtn}>
          Search
        </Button>
      </Space.Compact>
    </div>
  );
}
