import { useState } from 'react';
import { Col, Form, Row, message } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

import AdminCard from '../../../components/admin/AdminCard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import CreateEventForm from '../../CreateEventPage/CreateEventForm';
import EventLivePreview from '../../CreateEventPage/EventLivePreview';
import CreateEventDefault from '../../../assets/createEventDefault.png';
import type { AdminCreateEventFormValues } from '../../../services/admin-events.service';
import { useCreateAdminEvent } from '../../../hooks/queries/useEvents';

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
  eventType?: string;
  venue?: string;
  address?: string;
  organizer?: string;
  ticket_url?: string;
  startDate?: Dayjs;
  startTime?: Dayjs;
  endDate?: Dayjs;
  endTime?: Dayjs;
  price?: string;
};

function toFormValues(values: RawCreateEventValues): AdminCreateEventFormValues {
  if (!values.title || !values.description || !values.category || !values.eventType) {
    throw new Error('Please complete all required fields.');
  }

  if (!values.startDate || !values.startTime || !values.venue || !values.address || !values.organizer) {
    throw new Error('Please complete all required fields.');
  }

  return {
    title: values.title,
    description: values.description,
    category: values.category,
    eventType: values.eventType,
    venue: values.venue,
    address: values.address,
    organizer: values.organizer,
    ticket_url: values.ticket_url,
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

  const handleValuesChange = (_: unknown, allValues: RawCreateEventValues) => {
    setPreviewData({
      title: allValues.title || initialPreviewData.title,
      description: allValues.description || initialPreviewData.description,
      category: allValues.category || initialPreviewData.category,
      eventType: allValues.eventType || initialPreviewData.eventType,
      venue: allValues.venue || initialPreviewData.venue,
      address: allValues.address || initialPreviewData.address,
      organizer: allValues.organizer || initialPreviewData.organizer,
      price: allValues.price || initialPreviewData.price,
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
            initialValues={{ eventType: 'Offline', price: '0' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={15}>
                <CreateEventForm image={eventImage} setImage={setEventImage} />
              </Col>
              <Col xs={24} lg={9}>
                <EventLivePreview data={previewData} image={currentPreviewImage} />
              </Col>
            </Row>
          </Form>
        </div>
      </AdminCard>
    </>
  );
}
