import { useEffect } from 'react';
import { Button, Form, Input, Modal, Switch } from 'antd';

import type { AdminCategory } from '../../../components/admin/types';
import type { CategoryFormPayload } from './categoryApi';

import styles from './AdminCategoryModal.module.css';

type CategoryFormValues = CategoryFormPayload;

interface AdminCategoryModalProps {
  open: boolean;
  category: AdminCategory | null;
  onClose: () => void;
  onSave: (values: CategoryFormValues) => Promise<void>;
  saving: boolean;
}

export default function AdminCategoryModal({
  open,
  category,
  onClose,
  saving,
  onSave,
}: AdminCategoryModalProps) {
  const [form] = Form.useForm<CategoryFormValues>();
  const isEditMode = Boolean(category);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (category) {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
      });
      return;
    }

    form.setFieldsValue({
      name: '',
      slug: '',
      description: '',
      isActive: true,
    });
  }, [category, form, open]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    await onSave(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={isEditMode ? 'Edit Category' : 'Add Category'}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      centered
      width={520}
      className={`admin-detail-modal ${styles.modal}`}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
        requiredMark="optional">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}>
          <Input placeholder="Category name" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, message: 'Slug is required' },
            {
              pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Use lowercase letters, numbers, and hyphens only',
            },
          ]}>
          <Input placeholder="category-slug" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Short description for this category" />
        </Form.Item>
        <Form.Item name="isActive" label="Enabled" valuePropName="checked">
          <Switch />
        </Form.Item>

        <footer className={styles.footer}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            className="admin-btn-edit"
            htmlType="submit"
            loading={saving}>
            Save
          </Button>
        </footer>
      </Form>
    </Modal>
  );
}
