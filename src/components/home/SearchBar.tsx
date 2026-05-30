import { Input, Select, Button } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchGroup}>
        <SearchOutlined className={styles.icon} />
        <Input 
          placeholder="Search events, categories, or keywords..." 
            variant="borderless"
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

      <Button type="primary" className={styles.searchBtn}>
        Search
      </Button>
    </div>
  );
}

