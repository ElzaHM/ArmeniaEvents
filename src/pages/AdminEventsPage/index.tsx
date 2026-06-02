import { Button, Modal, Table, Tag, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import AdminCard from '../../components/admin/AdminCard';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import type { AdminEvent, AdminEventStatus } from '../../components/admin/types';
import { useDeleteEvent, useEvents, useCreateEvent } from '../../hooks/queries/useEvents';

import styles from './AdminEventsPage.module.css';

const STATUS_COLORS: Record<AdminEventStatus, string> = {
  published: 'success',
  draft: 'warning',
  archived: 'default',
};

export default function AdminEventsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: eventsData = [], isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  const events: AdminEvent[] = eventsData.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    category: event.category,
    location: event.location,
    views: 0,
    maxViews: 1000,
    status: 'published',
    imageUrl: event.imageUrl,
  }));

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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          danger
          size="small"
          onClick={() => {
            Modal.confirm({
              title: 'Delete event?',
              content: `This will delete "${record.title}".`,
              onOk: async () => {
                try {
                  await deleteEvent.mutateAsync(record.id);
                  messageApi.success('Event deleted');
                } catch (error) {
                  messageApi.error(error instanceof Error ? error.message : 'Delete failed');
                }
              },
            });
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleCreate = async () => {
    try {
      await createEvent.mutateAsync({
        title: `New Event ${new Date().toLocaleTimeString()}`,
        start_date: new Date().toISOString(),
        address: 'Yerevan',
        venue: 'Event Venue',
        status: 'draft',
        views: 0,
      });
      messageApi.success('Event created');
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Create failed');
    }
  };

  return (
    <>
      {contextHolder}
      <AdminPageHeader
        title="Events"
        subtitle="Manage and organize all platform events."
      />
      <AdminCard>
        <div className={styles.toolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} loading={createEvent.isPending}>
            Add Event
          </Button>
        </div>
        <div className={styles.tableWrap}>
          <Table
            columns={columns}
            dataSource={events}
            rowKey="id"
            loading={isLoading || deleteEvent.isPending}
            pagination={{ pageSize: 8 }}
          />
        </div>
      </AdminCard>
    </>
  );
}
