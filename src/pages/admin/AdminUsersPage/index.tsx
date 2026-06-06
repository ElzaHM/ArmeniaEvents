import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Button, Empty, Form, Input, Modal, Select, Space, Spin, Table, Tag, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import AdminCard from '../../../components/admin/AdminCard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import type { AdminUser, AdminUserRole, AdminUserStatus } from '../../../components/admin/types';
import { useAdminUsers } from '../../../hooks/queries/useAdminUsers';

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

type UserModalMode = 'details' | 'edit';

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<AdminUser>();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: users = [], isLoading, isError, error } = useAdminUsers();
  const [tableUsers, setTableUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalMode, setModalMode] = useState<UserModalMode>('details');
  const searchQuery = searchParams.get('q')?.trim() ?? '';

  useEffect(() => {
    setTableUsers(users);
  }, [users]);

  useEffect(() => {
    if (selectedUser && modalMode === 'edit') {
      form.setFieldsValue(selectedUser);
    }
  }, [form, modalMode, selectedUser]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return tableUsers;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    return tableUsers.filter((user) => {
      const name = user.name.toLowerCase();
      const email = user.email.toLowerCase();
      return name.includes(normalizedQuery) || email.includes(normalizedQuery);
    });
  }, [searchQuery, tableUsers]);

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    setSearchParams(nextParams);
  };

  const openUserModal = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode('details');
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setModalMode('details');
    form.resetFields();
  };

  const openEditMode = () => {
    if (!selectedUser) {
      return;
    }

    form.setFieldsValue(selectedUser);
    setModalMode('edit');
  };

  const handleSaveUser = async () => {
    const values = await form.validateFields();
    setTableUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser?.id
          ? {
              ...user,
              name: values.name,
              email: values.email,
              role: values.role,
              status: values.status,
            }
          : user,
      ),
    );
    messageApi.success('User changes saved');
    closeUserModal();
  };

  const handleDeleteUser = (user: AdminUser | null) => {
    if (!user) {
      return;
    }

    Modal.confirm({
      title: 'Delete user?',
      content: `This will remove "${user.name}" from the current admin table.`,
      okText: 'Delete User',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => {
        setTableUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id));
        messageApi.success('User deleted');
        closeUserModal();
      },
    });
  };

  const emptySearchDescription = `No results found for '${searchQuery}'. Please try a different search term.`;

  const columns: TableColumnsType<AdminUser> = [
    {
      title: 'User (Name)',
      key: 'name',
      sorter: (left, right) => left.name.localeCompare(right.name),
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
      responsive: ['md'],
      render: (role: AdminUserRole) => (
        <Tag color={ROLE_COLORS[role]}>{role.replace('_', ' ')}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (left, right) => left.status.localeCompare(right.status),
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
    {
      title: 'Joined',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      responsive: ['md'],
      sorter: (left, right) => left.joinedAt.localeCompare(right.joinedAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      responsive: ['md'],
      render: (_, record) => (
        <Space size="small" onClick={(event) => event.stopPropagation()}>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            className={`admin-btn-edit ${styles.editButton}`}
            onClick={() => {
              setSelectedUser(record);
              setModalMode('edit');
              form.setFieldsValue(record);
            }}>
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            className="admin-btn-delete"
            onClick={() => handleDeleteUser(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
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
          <>
            <div className={styles.tableHeader}>
              {searchQuery ? (
                <>
                  <h2 className={styles.tableTitle}>Found Users ({filteredUsers.length})</h2>
                  <Button onClick={clearSearch}>Clear Search</Button>
                </>
              ) : null}
            </div>
            <div className={styles.tableWrap}>
              <Spin spinning={isLoading}>
                {searchQuery && !isLoading && filteredUsers.length === 0 ? (
                  <div className={styles.emptyWrap}>
                    <Empty description={emptySearchDescription} />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    onRow={(record) => ({
                      onClick: () => openUserModal(record),
                      className: 'admin-table-row-clickable',
                    })}
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: 'max-content' }}
                  />
                )}
              </Spin>
            </div>
          </>
        )}
      </AdminCard>
      <Modal
        open={Boolean(selectedUser)}
        title={modalMode === 'edit' ? 'Edit User' : 'User Details'}
        footer={null}
        width={420}
        centered
        onCancel={closeUserModal}
        className={`admin-detail-modal ${styles.userModal}`}>
        {selectedUser && modalMode === 'details' ? (
          <div className={styles.modalContent}>
            <img src={selectedUser.avatarUrl} alt="" className={styles.modalAvatar} />
            <dl className={styles.detailList}>
              <div className={styles.detailRow}>
                <dt>Name</dt>
                <dd>{selectedUser.name}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Email</dt>
                <dd>{selectedUser.email}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Role</dt>
                <dd>
                  <Tag color={ROLE_COLORS[selectedUser.role]}>
                    {selectedUser.role.replace('_', ' ')}
                  </Tag>
                </dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Status</dt>
                <dd>
                  <Tag color={STATUS_COLORS[selectedUser.status]}>{selectedUser.status}</Tag>
                </dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Joined</dt>
                <dd>{selectedUser.joinedAt}</dd>
              </div>
            </dl>
            <div className={styles.modalActions}>
              <Button danger onClick={() => handleDeleteUser(selectedUser)}>
                Delete
              </Button>
              <Button type="primary" className="admin-btn-edit" onClick={openEditMode}>
                Edit
              </Button>
            </div>
          </div>
        ) : null}
        {selectedUser && modalMode === 'edit' ? (
          <div className={styles.modalContent}>
            <img src={selectedUser.avatarUrl} alt="" className={styles.modalAvatar} />
            <Form form={form} layout="vertical" initialValues={selectedUser}>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item name="role" label="Role">
                <Select
                  options={[
                    { value: 'super_admin', label: 'Super Admin' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'moderator', label: 'Moderator' },
                    { value: 'user', label: 'User' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="status" label="Status">
                <Select
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'pending', label: 'Pending' },
                  ]}
                />
              </Form.Item>
            </Form>
            <div className={styles.modalActions}>
              <Button onClick={() => setModalMode('details')}>Cancel</Button>
              <Button type="primary" onClick={handleSaveUser}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
