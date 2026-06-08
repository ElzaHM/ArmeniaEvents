import {useCallback, useEffect, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {Button, Form, Input, Modal, Spin, Upload, message} from "antd";
import type {UploadChangeParam} from "antd/es/upload";
import {CameraOutlined, EyeOutlined, SaveOutlined} from "@ant-design/icons";

import AdminCard from "../../../components/admin/AdminCard";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import {DEFAULT_ADMIN_DISPLAY} from "../../../components/admin/adminDefaults";
import {useAuth} from "../../../hooks/useAuth";
import {
  adminProfileQueryKey,
  adminProfileQueryOptions,
  fetchAdminProfile,
  isIgnorableSupabaseSessionError,
  saveAdminProfile,
  uploadProfileAvatar,
  type ProfileFormValues,
  type ProfileState,
} from "./profileApi";
import {useAdminProfileDisplay} from "./useAdminProfileDisplay";

import styles from "./AdminProfilePage.module.css";

type PendingAvatar = {
  url: string;
  file: File;
  name: string;
};

function revokeBlobUrl(url?: string | null): void {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export default function AdminProfilePage() {
  const {session, syncSessionProfile} = useAuth();
  const {avatarUrl: cachedAvatarUrl} = useAdminProfileDisplay();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<ProfileFormValues>();
  const [baselineProfile, setBaselineProfile] = useState<ProfileState | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(cachedAvatarUrl);
  const [pendingAvatar, setPendingAvatar] = useState<PendingAvatar | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const accessToken = session?.accessToken;

  const {data: profile, isLoading: isLoadingProfile} = useQuery({
    queryKey: [...adminProfileQueryKey, accessToken ?? "anonymous"],
    queryFn: () => fetchAdminProfile(accessToken!),
    enabled: Boolean(accessToken),
    staleTime: adminProfileQueryOptions.staleTime,
    gcTime: adminProfileQueryOptions.gcTime,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  const applyProfileToForm = useCallback(
    (nextProfile: ProfileState) => {
      form.setFieldsValue({
        firstName: nextProfile.firstName,
        lastName: nextProfile.lastName,
        email: nextProfile.email,
        phone: nextProfile.phone,
        position: nextProfile.position,
        location: nextProfile.location,
      });
      setAvatarUrl(nextProfile.avatarUrl);
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
    if (!profile) {
      return;
    }

    setBaselineProfile(profile);
    applyProfileToForm(profile);
    clearPendingAvatar();
  }, [applyProfileToForm, clearPendingAvatar, profile]);

  useEffect(() => {
    if (!pendingAvatar) {
      setAvatarUrl(cachedAvatarUrl);
    }
  }, [cachedAvatarUrl, pendingAvatar]);

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
    if (!accessToken) {
      messageApi.error("You must be signed in to save profile changes.");
      return;
    }

    setIsSaving(true);

    try {
      let nextAvatarUrl = baselineProfile?.avatarUrl ?? avatarUrl;

      if (pendingAvatar) {
        nextAvatarUrl = await uploadProfileAvatar(pendingAvatar.file);
      }

      if (!baselineProfile) {
        messageApi.error("Profile is still loading. Please try again.");
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
      syncSessionProfile(`${savedProfile.firstName} ${savedProfile.lastName}`.trim());
      messageApi.success("Profile saved successfully");
    } catch (saveError) {
      const errorMessage =
        saveError instanceof Error ? saveError.message : "Failed to save profile";

      if (!isIgnorableSupabaseSessionError(errorMessage)) {
        messageApi.error(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!baselineProfile) {
      form.resetFields();
      setAvatarUrl(cachedAvatarUrl || DEFAULT_ADMIN_DISPLAY.avatarUrl);
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
        <Spin spinning={isLoadingProfile && !profile}>
          <div className={styles.profileLayout}>
            <aside className={styles.photoPanel}>
              <button
                type="button"
                className={styles.avatarButton}
                onClick={() => setIsPreviewOpen(true)}
                aria-label="Preview admin profile photo">
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

            <Form form={form} layout="vertical" className={styles.form} onFinish={handleSave}>
              <div className={styles.formGrid}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{required: true, message: "First name is required"}]}>
                  <Input disabled={isLoadingProfile || isSaving} />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName">
                  <Input disabled={isLoadingProfile || isSaving} />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {required: true, message: "Email is required"},
                    {type: "email", message: "Enter a valid email"},
                  ]}>
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
                  disabled={isLoadingProfile && !profile}>
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
        className={`admin-detail-modal ${styles.previewModal}`}>
        <img src={avatarPreviewUrl} alt="Admin profile preview" className={styles.previewImage} />
      </Modal>
    </>
  );
}
