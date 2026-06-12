import { useState } from 'react';
import { Button, Col, Form, Input, Row, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import AdminCard from '../../../components/admin/AdminCard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import CreateEventForm from '../../CreateEventPage/CreateEventForm';
import EventLivePreview from '../../CreateEventPage/EventLivePreview';
import CreateEventDefault from '../../../assets/createEventDefault.png';
import type { AdminCreateEventFormValues } from '../../../services/admin-events.service';
import { useCreateAdminEvent } from '../../../hooks/queries/useEvents';
import { fetchAdminCategories } from '../AdminCategoriesPage/categoryApi';
import {
  adminCategoriesQueryKey,
  selectActiveEventCategories,
  toCategoryAutoCompleteOptions,
} from '../AdminEventsPage/eventCategories';

import styles from './AdminCreateEventPage.module.css';

const PLACEHOLDER_IMAGE = `${CreateEventDefault}`;

const initialPreviewData = {
  title: 'AI Conference Armenia',
  description: 'Join the biggest tech event in Yerevan.',
  category: 'Technology',
  eventType: 'Offline',
  venue: 'Meridian Expo Center',
  address: 'Yerevan, Armenia',
  date: 'Jul 15, 2026',
  startTime: '10:00 AM',
  endTime: '06:00 PM',
  organizer: 'Tech Armenia',
  price: '0',
};

type RawCreateEventValues = {
  title?: string;
  description?: string;
  category?: string;
  venue?: string;
  address?: string;
  organizer?: string;
  language?: string;
  ageRange?: string;
  startDate?: Dayjs;
  startTime?: Dayjs;
  endDate?: Dayjs;
  endTime?: Dayjs;
  price?: string | number;
  isFree?: boolean;
};

function toFormValues(values: RawCreateEventValues): AdminCreateEventFormValues {
  if (!values.title || !values.description || !values.category) {
    throw new Error('Please complete all required fields.');
  }

  if (!values.startDate || !values.startTime || !values.venue || !values.address || !values.organizer) {
    throw new Error('Please complete all required fields.');
  }

  const isFree = values.isFree ?? true;
  const rawPrice = values.price == null || values.price === '' ? 0 : Number(values.price);

  if (!isFree && (!Number.isFinite(rawPrice) || rawPrice <= 0)) {
    throw new Error('Please enter a valid price for paid events.');
  }

  return {
    title: values.title,
    description: values.description,
    category: values.category,
    venue: values.venue,
    address: values.address,
    organizer: values.organizer,
    language: values.language,
    ageRange: values.ageRange,
    isFree,
    price: isFree ? 0 : rawPrice,
    startDate: values.startDate,
    startTime: values.startTime,
    endDate: values.endDate,
    endTime: values.endTime,
  };
}

export default function AdminCreateEventPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createAdminEvent = useCreateAdminEvent();
  const [eventImage, setEventImage] = useState<{ url: string; name: string } | null>(null);
  const [previewData, setPreviewData] = useState(initialPreviewData);
  const { data: activeCategories = [] } = useQuery({
    queryKey: adminCategoriesQueryKey,
    queryFn: fetchAdminCategories,
    select: selectActiveEventCategories,
  });
  const categoryOptions = toCategoryAutoCompleteOptions(activeCategories);

  const goToEventsList = () => {
    navigate('/admin/events');
  };

  const handleValuesChange = (_: unknown, allValues: RawCreateEventValues) => {
    setPreviewData({
      title: allValues.title || initialPreviewData.title,
      description: allValues.description || initialPreviewData.description,
      category: allValues.category || initialPreviewData.category,
      eventType: 'Offline',
      venue: allValues.venue || initialPreviewData.venue,
      address: allValues.address || initialPreviewData.address,
      organizer: allValues.organizer || initialPreviewData.organizer,
      price: allValues.isFree
        ? '0'
        : allValues.price != null && allValues.price !== ''
          ? String(allValues.price)
          : initialPreviewData.price,
      date: allValues.startDate
        ? dayjs(allValues.startDate).format('MMM DD, YYYY')
        : initialPreviewData.date,
      startTime: allValues.startTime
        ? dayjs(allValues.startTime).format('hh:mm A')
        : initialPreviewData.startTime,
      endTime: allValues.endTime
        ? dayjs(allValues.endTime).format('hh:mm A')
        : initialPreviewData.endTime,
    });
  };

  const onFinish = async (values: RawCreateEventValues) => {
    if (!eventImage) {
      message.error('Please upload an image before creating the event.');
      return;
    }

    if (createAdminEvent.isPending) {
      return;
    }

    try {
      const payload = toFormValues(values);
      await createAdminEvent.mutateAsync({ values: payload, image: eventImage });
      message.success('Event created successfully');
      navigate('/admin/events');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to create event.');
    }
  };

  const currentPreviewImage = eventImage?.url || PLACEHOLDER_IMAGE;

  return (
    <>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={goToEventsList}
        className={styles.backButton}>
        Back to Events
      </Button>
      <AdminPageHeader
        title="Create Event"
        subtitle="Add a new event with live preview before publishing."
      />
      <AdminCard className={styles.createCard}>
        <div
          className={`${styles.workspace} ${createAdminEvent.isPending ? styles.submitting : ''}`}
        >
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            onFinish={onFinish}
            initialValues={{ isFree: true }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={15}>
                <CreateEventForm
                  image={eventImage}
                  setImage={setEventImage}
                  categoryOptions={categoryOptions}
                />
                <div className={styles.extraFields}>
                  <h3 className={styles.extraFieldsTitle}>Additional Details</h3>
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
                </div>
              </Col>
              <Col xs={24} lg={9}>
                <EventLivePreview
                  data={previewData}
                  image={currentPreviewImage}
                  onCancel={goToEventsList}
                  submitLoading={createAdminEvent.isPending}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </AdminCard>
    </>
  );
}
