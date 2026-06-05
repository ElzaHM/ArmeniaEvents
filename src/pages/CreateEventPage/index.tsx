import { useState } from 'react';
import { Form, Row, Col, ConfigProvider, theme, Typography, message } from 'antd';
import dayjs from 'dayjs';
import CreateEventForm from './CreateEventForm';
import EventLivePreview from './EventLivePreview';
import styles from './CreateEventPage.module.css';
import CreateEventDefault from '../../assets/createEventDefault.png'

const { Title, Paragraph } = Typography;
const PLACEHOLDER_IMAGE = `${CreateEventDefault}`;

export default function CreateEventPage() {
  const [form] = Form.useForm();
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [previewData, setPreviewData] = useState({
    title: 'AI Conference Armenia',
    description: 'Annual AI conference in Yerevan',
    category: 'Technology',
    venue: 'Meridian Expo Center',
    address: 'Yerevan, Armenia',
    date: 'Jul 15, 2026',
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    organizer: 'Tech Armenia'
  });

  const handleValuesChange = (_: any, allValues: any) => {
    setPreviewData({
      ...previewData,
      title: allValues.title || 'Event Title',
      description: allValues.description || 'Description...',
      category: allValues.category || 'Category',
      venue: allValues.venue || 'Venue',
      address: allValues.address || 'Address',
      organizer: allValues.organizer || 'Organizer',
      date: allValues.startDate ? dayjs(allValues.startDate).format('MMM DD, YYYY') : 'Date',
      startTime: allValues.startTime ? dayjs(allValues.startTime).format('hh:mm A') : '10:00 AM',
      endTime: allValues.endTime ? dayjs(allValues.endTime).format('hh:mm A') : '06:00 PM',
    });
  };

  const onFinish = (values: any) => {
    if (images.length === 0) {
      message.error("Please upload at least one image");
      return;
    }
    console.log("Validated Data:", values);
    message.success("Event created successfully!");
  };

  const currentPreviewImage = images[selectedIndex]?.url || PLACEHOLDER_IMAGE;

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className={styles.pageWrapper}>
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
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={15}>
                <CreateEventForm 
                  images={images} 
                  setImages={setImages} 
                  selectedIndex={selectedIndex} 
                  setSelectedIndex={setSelectedIndex} 
                  previewImage={currentPreviewImage}
                />
              </Col>
              <Col xs={24} lg={9}>
                <EventLivePreview data={previewData} image={currentPreviewImage} />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
}