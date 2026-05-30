import { Button, Switch, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import AdminCard from '../../components/admin/AdminCard';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { getAdminCategories } from '../../components/admin/mockData';
import type { AdminCategory } from '../../components/admin/types';

import styles from './AdminCategoriesPage.module.css';

export default function AdminCategoriesPage() {
  const categories = getAdminCategories();

  const columns: TableColumnsType<AdminCategory> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug', responsive: ['md'] },
    {
      title: 'Events',
      dataIndex: 'eventCount',
      key: 'eventCount',
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['lg'],
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Enabled',
      key: 'toggle',
      render: (_, record) => <Switch checked={record.isActive} size="small" />,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Categories"
        subtitle="Organize events into meaningful categories."
      />
      <AdminCard>
        <div className={styles.toolbar}>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Category
          </Button>
        </div>
        <div className={styles.tableWrap}>
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        </div>
      </AdminCard>
    </>
  );
}
