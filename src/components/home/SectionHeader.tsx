import { Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  viewAllHref = '/events',
  viewAllLabel = 'View all',
  className,
}: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${className ?? ''}`.trim()}>
      <Typography.Title level={3} className={styles.title}>
        {title}
      </Typography.Title>
      <Link to={viewAllHref} className={styles.viewAll}>
        {viewAllLabel}
        <ArrowRightOutlined />
      </Link>
    </div>
  );
}
