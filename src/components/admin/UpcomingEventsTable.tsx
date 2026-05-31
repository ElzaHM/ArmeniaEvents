import { useState } from 'react';
import { Dropdown, Progress, Table, Tag } from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import AdminCard from './AdminCard';
import type { AdminEvent, AdminEventStatus } from './types';

import styles from './UpcomingEventsTable.module.css';

const STATUS_CONFIG: Record<
  AdminEventStatus,
  { label: string; color: 'success' | 'warning' | 'default' }
> = {
  published: { label: 'Published', color: 'success' },
  draft: { label: 'Draft', color: 'warning' },
  archived: { label: 'Archived', color: 'default' },
};

const ACTION_ITEMS: MenuProps['items'] = [
  { key: 'edit', label: 'Edit' },
  { key: 'view', label: 'View' },
  { key: 'delete', label: 'Delete', danger: true },
];

interface UpcomingEventsTableProps {
  events: AdminEvent[];
}

export default function UpcomingEventsTable({ events }: UpcomingEventsTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const columns: TableColumnsType<AdminEvent> = [
    {
      title: 'Event',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <div className={styles.eventCell}>
          <img src={record.imageUrl} alt="" className={styles.thumbnail} />
          <span className={styles.eventTitle}>{record.title}</span>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      responsive: ['md'],
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['lg'],
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      responsive: ['xl'],
    },
    {
      title: 'Views',
      key: 'views',
      render: (_, record) => {
        const percent = Math.round((record.views / record.maxViews) * 100);
        return (
          <div className={styles.viewsCell}>
            <div className={styles.viewsMeta}>
              <span>{record.views.toLocaleString()}</span>
              <span>{percent}%</span>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor="var(--admin-gold)"
              railColor="var(--admin-border)"
              size="small"
            />
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AdminEventStatus) => {
        const config = STATUS_CONFIG[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      render: () => (
        <Dropdown menu={{ items: ACTION_ITEMS }} trigger={['click']}>
          <button type="button" aria-label="Actions">
            <MoreOutlined />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <AdminCard title="Upcoming Events">
      <div className={styles.tableWrap}>
        <Table
          columns={columns}
          dataSource={events}
          rowKey="id"
          pagination={{
            current: page,
            pageSize,
            total: events.length,
            onChange: setPage,
            showSizeChanger: false,
          }}
          size="middle"
        />
      </div>
    </AdminCard>
  );
}
