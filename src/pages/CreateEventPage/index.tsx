import { useState } from 'react';
import { Form, Row, Col, Typography, message } from 'antd';
import dayjs from 'dayjs';
import CreateEventForm from './CreateEventForm';
import EventLivePreview from './EventLivePreview';
import styles from './CreateEventPage.module.css';
import '../../components/home/home.css';
import CreateEventDefault from'../../assets/createEventDefault.png'

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
  price: '0'
};

export default function CreateEventPage() {
  const [form] = Form.useForm();
  const [eventImage, setEventImage] = useState<{ url: string; name: string } | null>(null);
  const [previewData, setPreviewData] = useState(initialPreviewData);

  const handleValuesChange = (_: any, allValues: any) => {
    setPreviewData({
      title: allValues.title || initialPreviewData.title,
      description: allValues.description || initialPreviewData.description,
      category: allValues.category || initialPreviewData.category,
      eventType: allValues.eventType || initialPreviewData.eventType,
      venue: allValues.venue || initialPreviewData.venue,
      address: allValues.address || initialPreviewData.address,
      organizer: allValues.organizer || initialPreviewData.organizer,
      price: allValues.price || initialPreviewData.price,
      date: allValues.startDate ? dayjs(allValues.startDate).format('MMM DD, YYYY') : initialPreviewData.date,
      startTime: allValues.startTime ? dayjs(allValues.startTime).format('hh:mm A') : initialPreviewData.startTime,
      endTime: allValues.endTime ? dayjs(allValues.endTime).format('hh:mm A') : initialPreviewData.endTime,
    });
  };

  const onFinish = (values: any) => {
    if (!eventImage) {
      message.error("Please upload an image before creating the event.");
      return;
    }
    console.log("SUBMITTED DATA:", { ...values, image: eventImage });
    
    // Մաքրում ենք ամեն ինչ
    form.resetFields();
    setEventImage(null);
    setPreviewData(initialPreviewData);
    
    message.success("Your event has been submitted! Waiting for admin approval.");
  };

  const currentPreviewImage = eventImage?.url || PLACEHOLDER_IMAGE;

  return (
    <div className={`${styles.pageWrapper} create-event-page`}>
      <div className="homeSection">
          <div className={styles.heroHeader}>
            <Title className={styles.mainTitle}>Create <span className={styles.goldText}>Event</span></Title>
            <Paragraph className={styles.heroSubtitle}>Share your experiences across Armenia.</Paragraph>
          </div>

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
    </div>
  );
}