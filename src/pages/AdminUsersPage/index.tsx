import { Alert, Spin, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';

import AdminCard from '../../components/admin/AdminCard';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import type { AdminUser, AdminUserRole, AdminUserStatus } from '../../components/admin/types';
import { useAdminUsers } from '../../hooks/queries/useAdminUsers';

import styles from './AdminUsersPage.module.css';

const ROLE_COLORS: Record<AdminUserRole, string> = {
  super_admin: 'gold',
  admin: 'blue',
  moderator: 'purple',
  user: 'default',
};

const STATUS_COLORS: Record<AdminUserStatus, string> = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
};

export default function AdminUsersPage() {
  const { data: users = [], isLoading, isError, error } = useAdminUsers();

  const columns: TableColumnsType<AdminUser> = [
    {
      title: 'User',
      key: 'name',
      render: (_, record) => (
        <div className={styles.userCell}>
          <img src={record.avatarUrl} alt="" className={styles.avatar} />
          <span>{record.name}</span>
        </div>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email', responsive: ['md'] },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: AdminUserRole) => (
        <Tag color={ROLE_COLORS[role]}>{role.replace('_', ' ')}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AdminUserStatus) => (
        <Tag color={STATUS_COLORS[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Events',
      dataIndex: 'eventsCreated',
      key: 'eventsCreated',
      responsive: ['lg'],
    },
    { title: 'Joined', dataIndex: 'joinedAt', key: 'joinedAt', responsive: ['lg'] },
  ];

  return (
    <>
      <AdminPageHeader
        title="Users"
        subtitle="View and manage registered platform users."
      />
      <AdminCard>
        {isError ? (
          <Alert
            type="error"
            showIcon
            message="Failed to load users"
            description={error instanceof Error ? error.message : 'Please try again.'}
          />
        ) : (
          <div className={styles.tableWrap}>
            <Spin spinning={isLoading}>
              <Table columns={columns} dataSource={users} rowKey="id" pagination={{ pageSize: 8 }} />
            </Spin>
          </div>
        )}
      </AdminCard>
    </>
  );
}
