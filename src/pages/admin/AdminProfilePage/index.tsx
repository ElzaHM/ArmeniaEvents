import {useMemo, useState} from "react";
import {Button, Form, Input, Modal, Upload, message} from "antd";
import type {UploadProps} from "antd";
import {CameraOutlined, EyeOutlined, SaveOutlined} from "@ant-design/icons";

import AdminCard from "../../../components/admin/AdminCard";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import {DEFAULT_ADMIN_DISPLAY} from "../../../components/admin/adminDefaults";
import {useAuth} from "../../../hooks/useAuth";

import styles from "./AdminProfilePage.module.css";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  location: string;
};

function splitFullName(fullName: string): Pick<ProfileFormValues, "firstName" | "lastName"> {
  const [firstName = "Admin", ...rest] = fullName.trim().split(/\s+/);
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

export default function AdminProfilePage() {
  const {session} = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<ProfileFormValues>();
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_ADMIN_DISPLAY.avatarUrl);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const initialValues = useMemo<ProfileFormValues>(() => {
    const nameParts = splitFullName(session?.user.fullName ?? DEFAULT_ADMIN_DISPLAY.name);

    return {
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      email: session?.user.email ?? "",
      phone: "",
      position: DEFAULT_ADMIN_DISPLAY.role,
      location: "Yerevan, Armenia",
    };
  }, [session]);

  const uploadProps: UploadProps = {
    accept: "image/*",
    beforeUpload: (file) => {
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
      return false;
    },
    fileList: [],
  };

  const handleSave = (values: ProfileFormValues) => {
    messageApi.success(`${values.firstName}'s profile details are ready to save.`);
  };

  const handleReset = () => {
    form.resetFields();
    setAvatarUrl(DEFAULT_ADMIN_DISPLAY.avatarUrl);
  };

  return (
    <>
      {contextHolder}
      <AdminPageHeader
        title="My Profile"
        subtitle="Update administrator identity, contact information, and photo."
      />
      <AdminCard>
        <div className={styles.profileLayout}>
          <aside className={styles.photoPanel}>
            <button
              type="button"
              className={styles.avatarButton}
              onClick={() => setIsPreviewOpen(true)}
              aria-label="Preview admin profile photo"
            >
              <img src={avatarUrl} alt="Admin profile" className={styles.avatar} />
              <span className={styles.previewBadge}>
                <EyeOutlined />
              </span>
            </button>
            <Upload {...uploadProps}>
              <Button icon={<CameraOutlined />}>Change Photo</Button>
            </Upload>
            <p className={styles.photoHint}>Use a square image for the cleanest sidebar and header crop.</p>
          </aside>

          <Form
            form={form}
            layout="vertical"
            className={styles.form}
            initialValues={initialValues}
            onFinish={handleSave}
          >
            <div className={styles.formGrid}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{required: true, message: "First name is required"}]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Last Name" name="lastName">
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {required: true, message: "Email is required"},
                  {type: "email", message: "Enter a valid email"},
                ]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>
              <Form.Item label="Position" name="position">
                <Input />
              </Form.Item>
              <Form.Item label="Location" name="location">
                <Input />
              </Form.Item>
            </div>

            <div className={styles.actions}>
              <Button onClick={handleReset}>Reset</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      </AdminCard>
      <Modal
        open={isPreviewOpen}
        footer={null}
        onCancel={() => setIsPreviewOpen(false)}
        centered
        className={styles.previewModal}
      >
        <img src={avatarUrl} alt="Admin profile preview" className={styles.previewImage} />
      </Modal>
    </>
  );
}
