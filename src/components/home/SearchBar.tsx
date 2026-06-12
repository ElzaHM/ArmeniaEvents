import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './SearchBar.module.css';

const SEARCH_PLACEHOLDER_DESKTOP = 'Search events, categories, or keywords...';
const SEARCH_PLACEHOLDER_COMPACT = 'Search events...';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [searchTerm, setSearchTerm] = useState('');
  const [compact, setCompact] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    setSearchTerm(qFromUrl);
  }, [qFromUrl]);

  const handleSearch = () => {
    const query = searchTerm.trim();
    if (query) {
      navigate(`/events?q=${encodeURIComponent(query)}`);
      return;
    }
    navigate('/events');
  };

  useEffect(() => {
    const compactMedia = window.matchMedia('(max-width: 768px)');
    const narrowMedia = window.matchMedia('(max-width: 576px)');
    const update = () => {
      setCompact(compactMedia.matches);
      setNarrow(narrowMedia.matches);
    };
    update();
    compactMedia.addEventListener('change', update);
    narrowMedia.addEventListener('change', update);
    return () => {
      compactMedia.removeEventListener('change', update);
      narrowMedia.removeEventListener('change', update);
    };
  }, []);

  return (
    <div className={[styles.searchBar, 'glassBlur', className].filter(Boolean).join(' ')}>
      <div className={styles.searchGroup}>
        <SearchOutlined className={styles.icon} />
        <Input
          placeholder={compact ? SEARCH_PLACEHOLDER_COMPACT : SEARCH_PLACEHOLDER_DESKTOP}
          variant="borderless"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onPressEnter={handleSearch}
          className={styles.inputField}
        />
      </div>

      <div className={styles.divider}></div>

      <div className={styles.locationGroup}>
        <EnvironmentOutlined className={styles.icon} />
        <Select 
          defaultValue="yerevan" 
          variant="borderless" 
          className={styles.locationSelect}
          suffixIcon={null}
        >
          <Select.Option value="yerevan">Yerevan, Armenia</Select.Option>
        </Select>
      </div>

      <Button
        type="primary"
        icon={narrow ? <SearchOutlined /> : undefined}
        aria-label="Search events"
        onClick={handleSearch}
        className={`homeActionBtn ${styles.searchBtn}${narrow ? ` ${styles.searchBtnIcon}` : ''}`}
      >
        {narrow ? null : 'Search'}
      </Button>
    </div>
  );
}

