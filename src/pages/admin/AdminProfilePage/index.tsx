import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Spin, Upload, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import { CameraOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';

import AdminCard from '../../../components/admin/AdminCard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import { DEFAULT_ADMIN_DISPLAY } from '../../../components/admin/adminDefaults';
import { useAuth } from '../../../hooks/useAuth';
import {
  fetchAdminProfile,
  saveAdminProfile,
  uploadProfileAvatar,
  type ProfileFormValues,
  type ProfileState,
} from './profileApi';

import styles from './AdminProfilePage.module.css';

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

export default function AdminProfilePage() {
  const { session } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<ProfileFormValues>();
  const [baselineProfile, setBaselineProfile] = useState<ProfileState | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_ADMIN_DISPLAY.avatarUrl);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const applyProfileToForm = useCallback(
    (profile: ProfileState) => {
      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        position: profile.position,
        location: profile.location,
      });
      setAvatarUrl(profile.avatarUrl);
    },
    [form],
  );

  const clearPendingAvatar = useCallback(() => {
    setPendingAvatar((current) => {
      revokeBlobUrl(current?.url);
      return null;
    });
  }, []);

  useEffect(() => {
    const accessToken = session?.accessToken;

    if (!accessToken) {
      setIsLoadingProfile(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const profile = await fetchAdminProfile(accessToken);

        if (cancelled) {
          return;
        }

        setBaselineProfile(profile);
        applyProfileToForm(profile);
        clearPendingAvatar();
      } catch (loadError) {
        if (!cancelled) {
          messageApi.error(loadError instanceof Error ? loadError.message : 'Failed to load profile');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [applyProfileToForm, clearPendingAvatar, messageApi, session?.accessToken]);

  useEffect(() => {
    return () => {
      revokeBlobUrl(pendingAvatar?.url);
    };
  }, [pendingAvatar?.url]);

  const handleAvatarUpload = (info: UploadChangeParam) => {
    const file = info.file.originFileObj ?? info.file;

    if (!(file instanceof File)) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPendingAvatar((current) => {
      revokeBlobUrl(current?.url);
      return {
        url: previewUrl,
        file,
        name: file.name,
      };
    });
    setAvatarUrl(previewUrl);
  };

  const avatarPreviewUrl = pendingAvatar?.url || avatarUrl;

  const handleSave = async (values: ProfileFormValues) => {
    const accessToken = session?.accessToken;

    if (!accessToken) {
      messageApi.error('You must be signed in to save profile changes.');
      return;
    }

    setIsSaving(true);

    try {
      let nextAvatarUrl = baselineProfile?.avatarUrl ?? avatarUrl;

      if (pendingAvatar) {
        nextAvatarUrl = await uploadProfileAvatar(pendingAvatar.file);
      }

      if (!baselineProfile) {
        messageApi.error('Profile is still loading. Please try again.');
        return;
      }

      const savedProfile = await saveAdminProfile(
        accessToken,
        baselineProfile,
        values,
        nextAvatarUrl,
      );

      setBaselineProfile(savedProfile);
      applyProfileToForm(savedProfile);
      clearPendingAvatar();
      messageApi.success('Profile saved successfully');
    } catch (saveError) {
      messageApi.error(saveError instanceof Error ? saveError.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!baselineProfile) {
      form.resetFields();
      setAvatarUrl(DEFAULT_ADMIN_DISPLAY.avatarUrl);
      clearPendingAvatar();
      return;
    }

    applyProfileToForm(baselineProfile);
    clearPendingAvatar();
  };

  return (
    <>
      {contextHolder}
      <AdminPageHeader
        title="My Profile"
        subtitle="Update administrator identity, contact information, and photo."
      />
      <AdminCard>
        <Spin spinning={isLoadingProfile}>
          <div className={styles.profileLayout}>
            <aside className={styles.photoPanel}>
              <button
                type="button"
                className={styles.avatarButton}
                onClick={() => setIsPreviewOpen(true)}
                aria-label="Preview admin profile photo"
              >
                <img src={avatarPreviewUrl} alt="Admin profile" className={styles.avatar} />
                <span className={styles.previewBadge}>
                  <EyeOutlined />
                </span>
              </button>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarUpload}>
                <Button icon={<CameraOutlined />} disabled={isLoadingProfile || isSaving}>
                  Change Photo
                </Button>
              </Upload>
              {pendingAvatar ? (
                <p className={styles.photoHint}>
                  {pendingAvatar.name} — will upload when you save.
                </p>
              ) : (
                <p className={styles.photoHint}>
                  Use a square image for the cleanest sidebar and header crop.
                </p>
              )}
            </aside>

            <Form
              form={form}
              layout="vertical"
              className={styles.form}
              onFinish={handleSave}
            >
              <div className={styles.formGrid}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'First name is required' }]}
                >
                  <Input disabled={isLoadingProfile || isSaving} />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName">
                  <Input disabled={isLoadingProfile || isSaving} />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Enter a valid email' },
                  ]}
                >
                  <Input type="email" disabled={isLoadingProfile || isSaving} />
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                  <Input disabled={isLoadingProfile || isSaving} />
                </Form.Item>
                <Form.Item label="Position" name="position">
                  <Input disabled={isLoadingProfile || isSaving} />
                </Form.Item>
                <Form.Item label="Location" name="location">
                  <Input disabled={isLoadingProfile || isSaving} />
                </Form.Item>
              </div>

              <div className={styles.actions}>
                <Button onClick={handleReset} disabled={isLoadingProfile || isSaving}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isSaving}
                  disabled={isLoadingProfile}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </div>
        </Spin>
      </AdminCard>
      <Modal
        open={isPreviewOpen}
        footer={null}
        onCancel={() => setIsPreviewOpen(false)}
        centered
        className={styles.previewModal}
      >
        <img src={avatarPreviewUrl} alt="Admin profile preview" className={styles.previewImage} />
      </Modal>
    </>
  );
}
