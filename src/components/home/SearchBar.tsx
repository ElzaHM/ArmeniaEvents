import { useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';

import { LOCATIONS } from './mockData';

import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('yerevan');

  const handleSearch = () => {
    onSearch?.(query, location);
  };

  return (
    <div className={styles.searchBar}>
      <Space.Compact className={styles.compact} block>
        <Input
          size="large"
          placeholder="Search events, categories, or keywords..."
          prefix={<SearchOutlined />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onPressEnter={handleSearch}
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
        <Button type="primary" size="large" onClick={handleSearch} className={styles.searchBtn}>
          Search
        </Button>
      </Space.Compact>
    </div>
  );
}
