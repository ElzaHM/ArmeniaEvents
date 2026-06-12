import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Tag,
  Upload,
  message,
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import { CameraOutlined } from '@ant-design/icons';

import { adminPendingNotificationsKey } from '../../../components/admin/AdminHeader';
import { formatAdminEventDate } from '../../../components/admin/mapApiEventToAdminEvent';
import type { AdminUser, AdminUserRole, AdminUserStatus } from '../../../components/admin/types';
import { adminUsersKeys } from '../../../hooks/queries/useAdminUsers';
import {
  deleteAdminUser,
  formatRoleLabel,
  normalizeEditRole,
  updateAdminUser,
  uploadUserAvatar,
  type UserEditPayload,
  type UserEditRole,
} from '../AdminUsersPage/userApi';

import styles from '../AdminUsersPage/AdminUsersPage.module.css';

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

export interface AdminUserModalProps {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
  onUsersChanged?: () => void | Promise<void>;
}

export default function AdminUserModal({
  user,
  open,
  onClose,
  onUsersChanged,
}: AdminUserModalProps) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<UserEditFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [modalMode, setModalMode] = useState<UserModalMode>('details');
  const [activeUser, setActiveUser] = useState<AdminUser | null>(null);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const clearPendingAvatar = () => {
    revokeBlobUrl(pendingAvatar?.url);
    setPendingAvatar(null);
  };

  useEffect(() => {
    if (open && user) {
      setActiveUser(user);
      setModalMode('details');
      clearPendingAvatar();
      form.resetFields();
    }
  }, [form, open, user]);

  useEffect(() => {
    if (activeUser && modalMode === 'edit') {
      form.setFieldsValue({
        name: activeUser.name,
        email: activeUser.email,
        role: normalizeEditRole(activeUser.role),
        status: activeUser.status,
      });
      clearPendingAvatar();
    }
  }, [activeUser, form, modalMode]);

  useEffect(() => {
    return () => {
      revokeBlobUrl(pendingAvatar?.url);
    };
  }, [pendingAvatar?.url]);

  const handleClose = () => {
    clearPendingAvatar();
    setActiveUser(null);
    setModalMode('details');
    form.resetFields();
    onClose();
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

  const getCurrentUser = () => activeUser ?? user;

  const openEditMode = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return;
    }

    form.setFieldsValue({
      name: currentUser.name,
      email: currentUser.email,
      role: normalizeEditRole(currentUser.role),
      status: currentUser.status,
    });
    clearPendingAvatar();
    setModalMode('edit');
  };

  const refreshUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
    await onUsersChanged?.();
  };

  const handleSaveUser = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return;
    }

    const values = await form.validateFields();
    setIsSaving(true);

    try {
      let avatarUrl = currentUser.avatarUrl;

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

      const updatedUser = await updateAdminUser(currentUser.id, payload, currentUser);

      setActiveUser(updatedUser);
      clearPendingAvatar();
      messageApi.success('User changes saved');
      await refreshUsers();
      await queryClient.invalidateQueries({ queryKey: adminPendingNotificationsKey });
      handleClose();
    } catch (saveError) {
      messageApi.error(saveError instanceof Error ? saveError.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return;
    }

    Modal.confirm({
      title: 'Delete user?',
      content: `This will permanently delete "${currentUser.name}" from Supabase Auth.`,
      okText: 'Delete User',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        setIsDeleting(true);

        try {
          await deleteAdminUser(currentUser.id);
          messageApi.success('User deleted');
          await refreshUsers();
          await queryClient.invalidateQueries({ queryKey: adminPendingNotificationsKey });
          handleClose();
        } catch (deleteError) {
          messageApi.error(deleteError instanceof Error ? deleteError.message : 'Delete failed');
          throw deleteError;
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  const resolvedUser = activeUser ?? (open ? user : null);
  const avatarPreviewUrl = pendingAvatar?.url || resolvedUser?.avatarUrl || '';

  if (!resolvedUser) {
    return contextHolder;
  }

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={null}
        footer={null}
        width={modalMode === 'edit' ? 360 : 400}
        centered
        destroyOnHidden
        onCancel={handleClose}
        className="admin-detail-modal"
        rootClassName={styles.userModal}>
        {modalMode === 'details' ? (
          <div className={styles.modalShell}>
            <div className={styles.scrollContent}>
              <header className={styles.detailHeader}>
                <img src={resolvedUser.avatarUrl} alt="" className={styles.modalAvatar} />
                <h2 className={styles.detailTitle}>{resolvedUser.name}</h2>
                <div className={styles.metaTags}>
                  <Tag color={ROLE_COLORS[resolvedUser.role]}>
                    {formatRoleLabel(resolvedUser.role)}
                  </Tag>
                  <Tag color={STATUS_COLORS[resolvedUser.status]}>{resolvedUser.status}</Tag>
                </div>
              </header>

              <section className={styles.infoCard}>
                <h3 className={styles.cardTitle}>User Info</h3>
                <dl className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <dt>Email</dt>
                    <dd>{resolvedUser.email}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Joined</dt>
                    <dd>{formatAdminEventDate(resolvedUser.joinedAt)}</dd>
                  </div>
                </dl>
              </section>

              <section className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Access</h3>
                <dl className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <dt>Role</dt>
                    <dd>
                      <Tag color={ROLE_COLORS[resolvedUser.role]}>
                        {formatRoleLabel(resolvedUser.role)}
                      </Tag>
                    </dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Status</dt>
                    <dd>
                      <Tag color={STATUS_COLORS[resolvedUser.status]}>{resolvedUser.status}</Tag>
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <footer className={styles.modalFooter}>
              <Button
                className="admin-btn-delete"
                loading={isDeleting}
                onClick={handleDeleteUser}>
                Delete
              </Button>
              <Button type="primary" className="admin-btn-edit" onClick={openEditMode}>
                Edit
              </Button>
            </footer>
          </div>
        ) : null}
        {modalMode === 'edit' ? (
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
