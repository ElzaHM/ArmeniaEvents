import { Button, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import AdminCard from '../../components/admin/AdminCard';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { getAdminEvents } from '../../components/admin/mockData';
import type { AdminEvent, AdminEventStatus } from '../../components/admin/types';

import styles from './AdminEventsPage.module.css';

const STATUS_COLORS: Record<AdminEventStatus, string> = {
  published: 'success',
  draft: 'warning',
  archived: 'default',
};

export default function AdminEventsPage() {
  const events = getAdminEvents();

  const columns: TableColumnsType<AdminEvent> = [
    {
      title: 'Event',
      key: 'title',
      render: (_, record) => (
        <div className={styles.eventCell}>
          <img src={record.imageUrl} alt="" className={styles.thumbnail} />
          <span>{record.title}</span>
        </div>
      ),
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Location', dataIndex: 'location', key: 'location', responsive: ['md'] },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AdminEventStatus) => (
        <Tag color={STATUS_COLORS[status]}>{status}</Tag>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Events"
        subtitle="Manage and organize all platform events."
      />
      <AdminCard>
        <div className={styles.toolbar}>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Event
          </Button>
        </div>
        <div className={styles.tableWrap}>
          <Table columns={columns} dataSource={events} rowKey="id" pagination={{ pageSize: 8 }} />
        </div>
      </AdminCard>
    </>
  );
}
