import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Upload,
  message,
} from 'antd';
import type { TableColumnsType } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import { CameraOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import AdminCard from '../../../components/admin/AdminCard';
import { adminPendingNotificationsKey } from '../../../components/admin/AdminHeader';
import { formatAdminEventDate } from '../../../components/admin/mapApiEventToAdminEvent';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import type { AdminUser, AdminUserRole, AdminUserStatus } from '../../../components/admin/types';
import { useAdminUsers } from '../../../hooks/queries/useAdminUsers';
import {
  deleteAdminUser,
  formatRoleLabel,
  normalizeEditRole,
  updateAdminUser,
  uploadUserAvatar,
  type UserEditPayload,
  type UserEditRole,
} from './userApi';

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

const ROLE_OPTIONS: { value: UserEditRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
];

const STATUS_OPTIONS: { value: AdminUserStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

type UserModalMode = 'details' | 'edit';

type UserEditFormValues = Omit<UserEditPayload, 'avatarUrl'>;

type PendingAvatar = {
  url: string;
  file: File;
  name: string;
};

function revokeBlobUrl(url?: string | null): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<UserEditFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: users = [], isLoading, isError, error } = useAdminUsers();
  const totalUsers = users.length;
  const [tableUsers, setTableUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalMode, setModalMode] = useState<UserModalMode>('details');
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const searchQuery = searchParams.get('q')?.trim() ?? '';
  const editUserId = searchParams.get('edit')?.trim() ?? '';
  const handledEditUserId = useRef<string | null>(null);

  useEffect(() => {
    setTableUsers(users);
  }, [users]);

  useEffect(() => {
    if (selectedUser && modalMode === 'edit') {
      form.setFieldsValue({
        name: selectedUser.name,
        email: selectedUser.email,
        role: normalizeEditRole(selectedUser.role),
        status: selectedUser.status,
      });
      setPendingAvatar(null);
    }
  }, [form, modalMode, selectedUser]);

  useEffect(() => {
    return () => {
      revokeBlobUrl(pendingAvatar?.url);
    };
  }, [pendingAvatar?.url]);

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

  const avatarPreviewUrl =
    pendingAvatar?.url || selectedUser?.avatarUrl || '';

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    setSearchParams(nextParams);
  };

  const clearPendingAvatar = () => {
    revokeBlobUrl(pendingAvatar?.url);
    setPendingAvatar(null);
  };

  const handleAvatarUpload = (info: UploadChangeParam) => {
    const file = info.file.originFileObj ?? info.file;

    if (!(file instanceof File)) {
      return;
    }

    revokeBlobUrl(pendingAvatar?.url);
    setPendingAvatar({
      url: URL.createObjectURL(file),
      file,
      name: file.name,
    });
  };

  const openUserModal = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode('details');
    clearPendingAvatar();
  };

  const closeUserModal = () => {
    clearPendingAvatar();
    setSelectedUser(null);
    setModalMode('details');
    form.resetFields();
  };

  const openEditMode = () => {
    if (!selectedUser) {
      return;
    }

    form.setFieldsValue({
      name: selectedUser.name,
      email: selectedUser.email,
      role: normalizeEditRole(selectedUser.role),
      status: selectedUser.status,
    });
    clearPendingAvatar();
    setModalMode('edit');
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode('edit');
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: normalizeEditRole(user.role),
      status: user.status,
    });
    clearPendingAvatar();
  };

  useEffect(() => {
    if (!editUserId || isLoading) {
      return;
    }

    if (handledEditUserId.current === editUserId) {
      return;
    }

    const user = users.find((entry) => entry.id === editUserId);

    if (!user) {
      return;
    }

    handledEditUserId.current = editUserId;
    openEditModal(user);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('edit');
    setSearchParams(nextParams, { replace: true });
  }, [editUserId, isLoading, users, searchParams, setSearchParams]);

  const handleSaveUser = async () => {
    if (!selectedUser) {
      return;
    }

    const values = await form.validateFields();
    setIsSaving(true);

    try {
      let avatarUrl = selectedUser.avatarUrl;

      if (pendingAvatar) {
        avatarUrl = await uploadUserAvatar(pendingAvatar.file);
      }

      const payload: UserEditPayload = {
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
        avatarUrl,
      };

      const updatedUser = await updateAdminUser(selectedUser.id, payload, selectedUser);

      setTableUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );
      setSelectedUser(updatedUser);
      clearPendingAvatar();
      messageApi.success('User changes saved');
      await refreshUsers();
      await queryClient.invalidateQueries({ queryKey: adminPendingNotificationsKey });
      closeUserModal();
    } catch (saveError) {
      messageApi.error(saveError instanceof Error ? saveError.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const refreshUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
  };

  const handleDeleteUser = (user: AdminUser | null) => {
    if (!user) {
      return;
    }

    Modal.confirm({
      title: 'Delete user?',
      content: `This will permanently delete "${user.name}" from Supabase Auth.`,
      okText: 'Delete User',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        setDeletingId(user.id);

        try {
          await deleteAdminUser(user.id);
          setTableUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id));
          messageApi.success('User deleted');
          await refreshUsers();
          await queryClient.invalidateQueries({ queryKey: adminPendingNotificationsKey });
          closeUserModal();
        } catch (deleteError) {
          messageApi.error(deleteError instanceof Error ? deleteError.message : 'Delete failed');
          throw deleteError;
        } finally {
          setDeletingId(null);
        }
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
        <Tag color={ROLE_COLORS[role]}>{formatRoleLabel(role)}</Tag>
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
      render: (joinedAt: string) => formatAdminEventDate(joinedAt),
      sorter: (left, right) => left.joinedAt.localeCompare(right.joinedAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" onClick={(event) => event.stopPropagation()}>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            className="admin-btn-edit"
            onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            className="admin-btn-delete"
            loading={deletingId === record.id}
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
      <div className={styles.totalUsersBadge} aria-live="polite">
        <span className={styles.totalUsersLabel}>Total registered users</span>
        <strong className={styles.totalUsersCount}>
          {isLoading ? '…' : totalUsers.toLocaleString('en-US')}
        </strong>
      </div>
      <AdminCard className={styles.adminTableCard}>
        {isError ? (
          <Alert
            type="error"
            showIcon
            title="Failed to load users"
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
              <Spin spinning={isLoading || deletingId !== null}>
                {searchQuery && !isLoading && filteredUsers.length === 0 ? (
                  <div className={styles.emptyWrap}>
                    <Empty description={emptySearchDescription} />
                  </div>
                ) : (
                  <Table
                    size="middle"
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    onRow={(record) => ({
                      onClick: () => openUserModal(record),
                      className: 'admin-table-row-clickable',
                    })}
                    pagination={{
                      defaultPageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '30', '50', '100'],
                      hideOnSinglePage: true,
                    }}
                    scroll={{ x: 'max-content' }}
                    styles={{
                      content: {
                        overflowY: 'visible',
                        maxHeight: 'none',
                        height: 'auto',
                      },
                      body: {
                        wrapper: {
                          overflowY: 'visible',
                          maxHeight: 'none',
                          height: 'auto',
                        },
                      },
                    }}
                  />
                )}
              </Spin>
            </div>
          </>
        )}
      </AdminCard>
      <Modal
        open={Boolean(selectedUser)}
        title={null}
        footer={null}
        width={modalMode === 'edit' ? 360 : 400}
        centered
        destroyOnHidden
        onCancel={closeUserModal}
        className="admin-detail-modal"
        rootClassName={styles.userModal}>
        {selectedUser && modalMode === 'details' ? (
          <div className={styles.modalShell}>
            <div className={styles.scrollContent}>
              <header className={styles.detailHeader}>
                <img src={selectedUser.avatarUrl} alt="" className={styles.modalAvatar} />
                <h2 className={styles.detailTitle}>{selectedUser.name}</h2>
                <div className={styles.metaTags}>
                  <Tag color={ROLE_COLORS[selectedUser.role]}>
                    {formatRoleLabel(selectedUser.role)}
                  </Tag>
                  <Tag color={STATUS_COLORS[selectedUser.status]}>{selectedUser.status}</Tag>
                </div>
              </header>

              <section className={styles.infoCard}>
                <h3 className={styles.cardTitle}>User Info</h3>
                <dl className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <dt>Email</dt>
                    <dd>{selectedUser.email}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Joined</dt>
                    <dd>{formatAdminEventDate(selectedUser.joinedAt)}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Access</h3>
                <dl className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <dt>Role</dt>
                    <dd>
                      <Tag color={ROLE_COLORS[selectedUser.role]}>
                        {formatRoleLabel(selectedUser.role)}
                      </Tag>
                    </dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Status</dt>
                    <dd>
                      <Tag color={STATUS_COLORS[selectedUser.status]}>{selectedUser.status}</Tag>
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <footer className={styles.modalFooter}>
              <Button
                className="admin-btn-delete"
                onClick={() => handleDeleteUser(selectedUser)}>
                Delete
              </Button>
              <Button type="primary" className="admin-btn-edit" onClick={openEditMode}>
                Edit
              </Button>
            </footer>
          </div>
        ) : null}
        {selectedUser && modalMode === 'edit' ? (
          <div className={styles.modalShell}>
            <div className={styles.scrollContent}>
              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Profile</h3>
                <div className={styles.avatarPanel}>
                  <img src={avatarPreviewUrl} alt="" className={styles.modalAvatar} />
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleAvatarUpload}>
                    <Button icon={<CameraOutlined />} size="small">
                      Change Photo
                    </Button>
                  </Upload>
                  {pendingAvatar ? (
                    <div className={styles.pendingAvatarBar}>
                      <span className={styles.pendingAvatarName}>{pendingAvatar.name}</span>
                      <Button type="link" size="small" onClick={clearPendingAvatar}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <p className={styles.avatarHint}>Upload a square image for the best crop.</p>
                  )}
                </div>
              </section>

              <Form form={form} layout="vertical" className={styles.editForm} requiredMark="optional">
                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>General</h3>
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Name is required' }]}>
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
                </section>

                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Access</h3>
                  <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Role is required' }]}>
                    <Select options={ROLE_OPTIONS} />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Status is required' }]}>
                    <Select options={STATUS_OPTIONS} />
                  </Form.Item>
                </section>
              </Form>
            </div>

            <footer className={styles.modalFooter}>
              <Button onClick={() => setModalMode('details')} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="primary" className="admin-btn-edit" loading={isSaving} onClick={handleSaveUser}>
                Save Changes
              </Button>
            </footer>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
