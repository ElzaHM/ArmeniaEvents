import { Pagination } from 'antd';

import styles from './EventPagination.module.css';

interface EventPaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function EventPagination({
  current,
  total,
  pageSize,
  onChange,
}: EventPaginationProps) {
  return (
    <div className={styles.pagination}>
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
      />
    </div>
  );
}
