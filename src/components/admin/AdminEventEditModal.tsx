import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
  Upload,
  message,
} from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import {
  DeleteOutlined,
  FileImageOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';

import {
  adminEventToEditFormValues,
  type AdminEventEditFormValues,
} from '../../services/admin-events.service';
import {
  fetchActiveCategories,
  toCategorySelectOptions,
} from '../../pages/admin/AdminEventsPage/eventCategories';
import { useUpdateAdminEvent } from '../../hooks/queries/useEvents';
import { handleAdminEventImageError, EVENT_IMAGE_PLACEHOLDER } from './mapApiEventToAdminEvent';
import type { AdminEvent, AdminEventStatus } from './types';

import styles from './AdminEventEditModal.module.css';

const { Text } = Typography;

const STATUS_OPTIONS: { value: AdminEventStatus; label: string }[] = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

type PendingImage = {
  url: string;
  name: string;
};

interface AdminEventEditModalProps {
  event: AdminEvent | null;
  open: boolean;
  onClose: () => void;
}

function revokeBlobUrl(url?: string | null): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export default function AdminEventEditModal({ event, open, onClose }: AdminEventEditModalProps) {
  const [form] = Form.useForm<AdminEventEditFormValues>();
  const updateAdminEvent = useUpdateAdminEvent();
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);

  const imageUrlValue = Form.useWatch('imageUrl', form);

  const { data: activeCategories = [] } = useQuery({
    queryKey: ['admin', 'active-categories'],
    queryFn: fetchActiveCategories,
    enabled: open,
  });

  const categorySelectOptions = useMemo(
    () => toCategorySelectOptions(activeCategories, event?.category ? [event.category] : []),
    [activeCategories, event?.category],
  );

  const previewSrc =
    pendingImage?.url || imageUrlValue?.trim() || event?.imageUrl || EVENT_IMAGE_PLACEHOLDER;

  useEffect(() => {
    if (open && event) {
      form.setFieldsValue(adminEventToEditFormValues(event));
      setPendingImage(null);
    }
  }, [event, form, open]);

  useEffect(() => {
    return () => {
      revokeBlobUrl(pendingImage?.url);
    };
  }, [pendingImage?.url]);

  const handleClose = () => {
    revokeBlobUrl(pendingImage?.url);
    setPendingImage(null);
    form.resetFields();
    onClose();
  };

  const handleUpload = (info: UploadChangeParam) => {
    const file = info.file.originFileObj ?? info.file;

    if (!(file instanceof File)) {
      return;
    }

    revokeBlobUrl(pendingImage?.url);
    setPendingImage({
      url: URL.createObjectURL(file),
      name: file.name,
    });
  };

  const clearPendingImage = () => {
    revokeBlobUrl(pendingImage?.url);
    setPendingImage(null);
  };

  const handleSubmit = async (values: AdminEventEditFormValues) => {
    if (!event) {
      return;
    }

    try {
      const savedImageUrl = await updateAdminEvent.mutateAsync({
        id: event.id,
        values,
        pendingImage,
      });

      if (savedImageUrl) {
        form.setFieldValue('imageUrl', savedImageUrl);
      }

      message.success('Event updated successfully');
      handleClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update event');
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Event"
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      centered
      width={760}
      className="admin-detail-modal">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
        requiredMark="optional">
        <div className={styles.scrollContent}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>General</h3>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Title is required' }]}>
              <Input placeholder="Event title" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Description is required' }]}>
              <Input.TextArea rows={3} placeholder="Event description" />
            </Form.Item>

            <div className={styles.imageBlock}>
              <span className={styles.imageLabel}>Event Image</span>
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt=""
                  className={styles.imagePreview}
                  onError={handleAdminEventImageError}
                />
              ) : (
                <div className={styles.imagePreviewFallback}>No image selected</div>
              )}

              <Form.Item name="imageUrl" label="Image URL" className={styles.imageUrlField}>
                <Input placeholder="https://... or upload a file below" />
              </Form.Item>

              {!pendingImage ? (
                <Upload.Dragger
                  className={styles.imageUpload}
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleUpload}
                  accept="image/*">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className={styles.uploadIcon} />
                  </p>
                  <Text className={styles.uploadHint}>Click or drag image to upload</Text>
                </Upload.Dragger>
              ) : (
                <div className={styles.uploadedFileBar}>
                  <div className={styles.fileDetails}>
                    <FileImageOutlined className={styles.fileIcon} />
                    <div className={styles.fileText}>
                      <Text strong className={styles.fileName}>
                        {pendingImage.name}
                      </Text>
                      <Text className={styles.fileMeta}>Ready to upload on save</Text>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    aria-label="Remove uploaded image"
                    onClick={clearPendingImage}>
                    <DeleteOutlined />
                  </button>
                </div>
              )}
            </div>

            <Form.Item name="externalId" label="External ID">
              <Input disabled />
            </Form.Item>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Classification</h3>
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Category is required' }]}>
                  <Select
                    showSearch
                    placeholder="Select category"
                    options={categorySelectOptions}
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <Select options={STATUS_OPTIONS} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="source" label="Source">
              <Input placeholder="Organizer or website name" />
            </Form.Item>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Location</h3>
            <Form.Item
              name="venue"
              label="Venue"
              rules={[{ required: true, message: 'Venue is required' }]}>
              <Input placeholder="Venue name" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Address is required' }]}>
              <Input placeholder="Street, city, country" />
            </Form.Item>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Details</h3>
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="startDate"
                  label="Start Date"
                  rules={[{ required: true, message: 'Start date is required' }]}>
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="price" label="Price (USD)">
                  <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0 = Free" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item name="language" label="Language">
                  <Input placeholder="English" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="ageRange" label="Age Range">
                  <Input placeholder="All ages" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item name="ticketUrl" label="Ticket URL">
                  <Input placeholder="https://..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="views" label="Views">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </section>
        </div>

        <footer className={styles.footer}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            className="admin-btn-edit"
            htmlType="submit"
            loading={updateAdminEvent.isPending}>
            Save Changes
          </Button>
        </footer>
      </Form>
    </Modal>
  );
}
