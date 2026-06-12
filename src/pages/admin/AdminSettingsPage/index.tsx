import { Button, Form, Input, Select, Switch } from 'antd';

import AdminCard from '../../../components/admin/AdminCard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import { DEFAULT_ADMIN_SETTINGS } from '../../../components/admin/adminDefaults';

import styles from './AdminSettingsPage.module.css';

export default function AdminSettingsPage() {
  const settings = DEFAULT_ADMIN_SETTINGS;
  const [form] = Form.useForm();

  return (
    <>
      <AdminPageHeader
        title="Settings"
        subtitle="Configure platform preferences and notifications."
      />
      <AdminCard>
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          initialValues={settings}
        >
          <h4 className={styles.sectionTitle}>General</h4>
          <Form.Item label="Site Name" name="siteName">
            <Input />
          </Form.Item>
          <Form.Item label="Support Email" name="supportEmail">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Default Language" name="defaultLanguage">
            <Select
              classNames={{ popup: { root: 'admin-select-dropdown' } }}
              options={[
                { value: 'en', label: 'English' },
                { value: 'hy', label: 'Armenian' },
                { value: 'ru', label: 'Russian' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Timezone" name="timezone">
            <Select
              classNames={{ popup: { root: 'admin-select-dropdown' } }}
              options={[
                { value: 'Asia/Yerevan', label: 'Asia/Yerevan (GMT+4)' },
                { value: 'UTC', label: 'UTC' },
              ]}
            />
          </Form.Item>

          <hr className={styles.divider} />

          <h4 className={styles.sectionTitle}>Platform</h4>
          <Form.Item
            label="Enable Notifications"
            name="enableNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Enable Public Registration"
            name="enablePublicRegistration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Maintenance Mode"
            name="maintenanceMode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <div className={styles.actions}>
            <Button>Reset</Button>
            <Button type="primary">Save Changes</Button>
          </div>
        </Form>
      </AdminCard>
    </>
  );
}
