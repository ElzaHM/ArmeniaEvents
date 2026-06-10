import { useState } from 'react';
import { Form, Row, Col, ConfigProvider, theme, Typography, message } from 'antd';
import dayjs from 'dayjs';
import CreateEventForm from './CreateEventForm';
import EventLivePreview from './EventLivePreview';
import FooterContent from '../../components/home/FooterContent';
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

export default function CreateEventPage() {
  const [form] = Form.useForm();
  const [eventImage, setEventImage] = useState<{ url: string; name: string } | null>(null);
  const [previewData, setPreviewData] = useState(initialPreviewData);

  const handleValuesChange = (_: unknown, allValues: Record<string, unknown>) => {
    setPreviewData({
      title: (allValues.title as string) || initialPreviewData.title,
      description: (allValues.description as string) || initialPreviewData.description,
      category: (allValues.category as string) || initialPreviewData.category,
      eventType: (allValues.eventType as string) || initialPreviewData.eventType,
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

  const onFinish = (values: Record<string, unknown>) => {
    if (!eventImage) {
      message.error('Please upload an image before creating the event.');
      return;
    }
    console.log('SUBMITTED DATA:', { ...values, image: eventImage });

    form.resetFields();
    setEventImage(null);
    setPreviewData(initialPreviewData);

    message.success('Your event has been submitted! Waiting for admin approval.');
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
            initialValues={{ eventType: 'Offline', isFree: true }}
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
        <div className={styles.footer}>
          <FooterContent />
        </div>
      </div>
    </ConfigProvider>
  );
}
