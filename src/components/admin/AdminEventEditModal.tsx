import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, KeyboardEvent } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
  message,
} from 'antd';
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
import { fetchAdminCategories } from '../../pages/admin/AdminCategoriesPage/categoryApi';
import {
  adminCategoriesQueryKey,
  isUncategorizedEvent,
  selectActiveEventCategories,
  toCategorySelectOptions,
} from '../../pages/admin/AdminEventsPage/eventCategories';
import { useUpdateAdminEvent } from '../../hooks/queries/useEvents';
import { handleAdminEventImageError, EVENT_IMAGE_PLACEHOLDER } from './mapApiEventToAdminEvent';
import type { AdminEvent, AdminEventStatus } from './types';

import styles from './AdminEventEditModal.module.css';

const { Text } = Typography;

const EVENT_FORM_PICKER_POPUP = {
  classNames: { popup: { root: 'event-form-picker-dropdown' } },
};
const EVENT_FORM_SELECT_POPUP = {
  classNames: { popup: { root: 'admin-select-dropdown' } },
};

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

function readImageFile(file: File, setPendingImage: (value: PendingImage) => void): void {
  if (!file.type.startsWith('image/')) {
    message.warning('Please select an image file');
    return;
  }

  setPendingImage({
    url: URL.createObjectURL(file),
    name: file.name,
  });
}

export default function AdminEventEditModal({ event, open, onClose }: AdminEventEditModalProps) {
  const [form] = Form.useForm<AdminEventEditFormValues>();
  const updateAdminEvent = useUpdateAdminEvent();
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: activeCategories = [] } = useQuery({
    queryKey: adminCategoriesQueryKey,
    queryFn: fetchAdminCategories,
    select: selectActiveEventCategories,
    enabled: open,
  });

  const categorySelectOptions = useMemo(
    () =>
      toCategorySelectOptions(
        activeCategories,
        event && !isUncategorizedEvent(event) && event.category ? [event.category] : [],
      ),
    [activeCategories, event],
  );

  const previewSrc =
    pendingImage?.url || event?.storedImageUrl || EVENT_IMAGE_PLACEHOLDER;

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

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    revokeBlobUrl(pendingImage?.url);
    readImageFile(file, setPendingImage);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    revokeBlobUrl(pendingImage?.url);
    readImageFile(file, setPendingImage);
  };

  const handleUploadKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFilePicker();
    }
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
      await updateAdminEvent.mutateAsync({
        id: event.id,
        values,
        pendingImage,
        existingImageUrl: event.storedImageUrl,
      });

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
      className="admin-detail-modal admin-event-edit-modal">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
        requiredMark="optional">
        <div className={styles.scrollContent}>
          <section className={styles.titleSection}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Title is required' }]}>
              <Input placeholder="Event title" />
            </Form.Item>
          </section>

          <div className={styles.mainLayout}>
            <div className={styles.leftStack}>
              <div className={styles.imageBlock}>
                <span className={styles.imageLabel}>Event Image</span>
                <div
                  className={styles.imageUploadWrapper}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload event image"
                  onClick={openFilePicker}
                  onKeyDown={handleUploadKeyDown}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}>
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
                  <div className={styles.imageUploadOverlay}>
                    <InboxOutlined className={styles.uploadIcon} />
                    <span className={styles.uploadHint}>Click or drag image to upload</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenFileInput}
                    onChange={handleFileInputChange}
                  />
                </div>

                {pendingImage ? (
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
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        clearPendingImage();
                      }}>
                      <DeleteOutlined />
                    </button>
                  </div>
                ) : null}
              </div>

              <Form.Item
                name="description"
                label="Description"
                className={styles.descriptionField}
                rules={[{ required: true, message: 'Description is required' }]}>
                <Input.TextArea rows={4} placeholder="Event description" />
              </Form.Item>

              <Form.Item name="externalId" label="External ID">
                <Input disabled />
              </Form.Item>

              <Form.Item name="language" label="Language (optional)">
                <Input placeholder="English" />
              </Form.Item>

              <Form.Item name="ageRange" label="Age Range (optional)">
                <Input placeholder="All ages" />
              </Form.Item>

              <Form.Item name="views" label="Views (optional)" className={styles.viewsField}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <div className={styles.rightStack}>
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
                        {...EVENT_FORM_SELECT_POPUP}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                      <Select options={STATUS_OPTIONS} {...EVENT_FORM_SELECT_POPUP} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="source" label="Source">
                  <Input placeholder="Organizer or website name" />
                </Form.Item>
                <Form.Item
                  name="sourceUrl"
                  label="Original Source URL"
                  rules={[
                    {
                      validator: async (_, value?: string) => {
                        const trimmed = value?.trim();
                        if (!trimmed) {
                          return;
                        }

                        try {
                          new URL(trimmed);
                        } catch {
                          throw new Error('Enter a valid URL');
                        }
                      },
                    },
                  ]}>
                  <Input placeholder="https://..." />
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
                <Form.Item
                  name="organizer"
                  label="Organizer Name"
                  rules={[{ required: true, message: 'Organizer is required' }]}>
                  <Input placeholder="Organizer or host name" />
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
                      <DatePicker
                        showTime
                        format="DD.MM.YYYY, HH:mm"
                        style={{ width: '100%' }}
                        {...EVENT_FORM_PICKER_POPUP}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="endDate" label="End Date">
                      <DatePicker
                        showTime
                        format="DD.MM.YYYY, HH:mm"
                        style={{ width: '100%' }}
                        allowClear
                        {...EVENT_FORM_PICKER_POPUP}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="isFree" label="Pricing">
                  <Radio.Group>
                    <Radio value={true}>Free</Radio>
                    <Radio value={false}>Paid</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item noStyle shouldUpdate={(prev, cur) => prev.isFree !== cur.isFree}>
                  {({ getFieldValue }) =>
                    !getFieldValue('isFree') ? (
                      <Form.Item
                        name="price"
                        label="Price (USD)"
                        rules={[
                          { required: true, message: 'Please enter a price' },
                          { type: 'number', min: 0.01, message: 'Price must be greater than 0' },
                        ]}>
                        <InputNumber min={0.01} step={0.01} precision={2} style={{ width: '100%' }} />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </section>
            </div>
          </div>
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
