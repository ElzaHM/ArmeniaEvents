import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App, Form, Row, Col, ConfigProvider, theme, Typography } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import CreateEventForm from './CreateEventForm';
import EventLivePreview from './EventLivePreview';
import FooterContent from '../../components/home/FooterContent';
import { useCategories } from '../../hooks/queries/useCategories';
import { useCreateAdminEvent } from '../../hooks/queries/useEvents';
import { useAuth } from '../../hooks/useAuth';
import type { AdminCreateEventFormValues } from '../../services/admin-events.service';
import styles from './CreateEventPage.module.css';
import '../../components/home/home.css';
import CreateEventDefault from '../../assets/createEventDefault.png';

const { Title, Paragraph } = Typography;
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
  startDate?: Dayjs;
  startTime?: Dayjs;
  endDate?: Dayjs;
  endTime?: Dayjs;
  price?: string | number;
  isFree?: boolean;
};

const CREATE_EVENT_DRAFT_KEY = 'create-event-draft';

type StoredCreateEventDraft = {
  title?: string;
  description?: string;
  category?: string;
  venue?: string;
  address?: string;
  organizer?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  price?: string | number;
  isFree?: boolean;
};

function saveCreateEventDraft(values: RawCreateEventValues): void {
  const draft: StoredCreateEventDraft = {
    title: values.title,
    description: values.description,
    category: values.category,
    venue: values.venue,
    address: values.address,
    organizer: values.organizer,
    startDate: values.startDate?.toISOString(),
    startTime: values.startTime?.toISOString(),
    endDate: values.endDate?.toISOString(),
    endTime: values.endTime?.toISOString(),
    price: values.price,
    isFree: values.isFree,
  };

  sessionStorage.setItem(CREATE_EVENT_DRAFT_KEY, JSON.stringify(draft));
}

function loadCreateEventDraft(): RawCreateEventValues | null {
  const raw = sessionStorage.getItem(CREATE_EVENT_DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    const draft = JSON.parse(raw) as StoredCreateEventDraft;
    return {
      title: draft.title,
      description: draft.description,
      category: draft.category,
      venue: draft.venue,
      address: draft.address,
      organizer: draft.organizer,
      startDate: draft.startDate ? dayjs(draft.startDate) : undefined,
      startTime: draft.startTime ? dayjs(draft.startTime) : undefined,
      endDate: draft.endDate ? dayjs(draft.endDate) : undefined,
      endTime: draft.endTime ? dayjs(draft.endTime) : undefined,
      price: draft.price,
      isFree: draft.isFree,
    };
  } catch {
    return null;
  }
}

function clearCreateEventDraft(): void {
  sessionStorage.removeItem(CREATE_EVENT_DRAFT_KEY);
}

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
    isFree,
    price: isFree ? 0 : rawPrice,
    startDate: values.startDate,
    startTime: values.startTime,
    endDate: values.endDate,
    endTime: values.endTime,
    status: 'draft',
  };
}

export default function CreateEventPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const createAdminEvent = useCreateAdminEvent();
  const draftRestoredRef = useRef(false);
  const [eventImage, setEventImage] = useState<{ url: string; name: string } | null>(null);
  const [previewData, setPreviewData] = useState(initialPreviewData);
  const { data: categories } = useCategories();
  const categoryOptions = useMemo(
    () => categories?.map((category) => ({ value: category.name })) ?? [],
    [categories],
  );

  const handleValuesChange = (_: unknown, allValues: Record<string, unknown>) => {
    setPreviewData({
      title: (allValues.title as string) || initialPreviewData.title,
      description: (allValues.description as string) || initialPreviewData.description,
      category: (allValues.category as string) || initialPreviewData.category,
      eventType: 'Offline',
      venue: (allValues.venue as string) || initialPreviewData.venue,
      address: (allValues.address as string) || initialPreviewData.address,
      organizer: (allValues.organizer as string) || initialPreviewData.organizer,
      price: allValues.isFree
        ? '0'
        : allValues.price != null && allValues.price !== ''
          ? String(allValues.price)
          : initialPreviewData.price,
      date: allValues.startDate
        ? dayjs(allValues.startDate as string).format('MMM DD, YYYY')
        : initialPreviewData.date,
      startTime: allValues.startTime
        ? dayjs(allValues.startTime as string).format('hh:mm A')
        : initialPreviewData.startTime,
      endTime: allValues.endTime
        ? dayjs(allValues.endTime as string).format('hh:mm A')
        : initialPreviewData.endTime,
    });
  };

  useEffect(() => {
    if (draftRestoredRef.current || authLoading || !isAuthenticated) {
      return;
    }

    const draft = loadCreateEventDraft();
    if (!draft) {
      return;
    }

    draftRestoredRef.current = true;
    form.setFieldsValue(draft);
    handleValuesChange(undefined, form.getFieldsValue(true));
    clearCreateEventDraft();
  }, [authLoading, form, isAuthenticated]);

  const onFinish = async (values: RawCreateEventValues) => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      saveCreateEventDraft(values);
      navigate('/signin', { state: { from: '/events/new' } });
      return;
    }

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

      clearCreateEventDraft();
      form.resetFields();
      setEventImage(null);
      setPreviewData(initialPreviewData);

      message.success('Your event has been submitted! Waiting for admin approval.');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to create event.');
    }
  };

  const currentPreviewImage = eventImage?.url || PLACEHOLDER_IMAGE;

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className={`${styles.pageWrapper} create-event-page`}>
        <div className="mainContent">
          <div className={styles.heroHeader}>
            <Title className={styles.mainTitle}>
              Create <span className={styles.goldText}>Event</span>
            </Title>
            <div className={styles.goldUnderline}></div>
            <Paragraph className={styles.heroSubtitle}>Share your experiences across Armenia.</Paragraph>
          </div>

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
              </Col>
              <Col xs={24} lg={9}>
                <EventLivePreview
                  data={previewData}
                  image={currentPreviewImage}
                  submitLoading={createAdminEvent.isPending}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles.footer}>
          <FooterContent />
        </div>
      </div>
    </ConfigProvider>
  );
}
