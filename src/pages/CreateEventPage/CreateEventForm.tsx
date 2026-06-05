import React from 'react';
import { 
  Form, Input, AutoComplete, DatePicker, TimePicker, 
  Row, Col, Typography, Space, Upload 
} from 'antd';
import { 
  InfoCircleOutlined, CalendarOutlined, InboxOutlined, 
  EnvironmentOutlined, LinkOutlined, UserOutlined, DeleteOutlined 
} from '@ant-design/icons';
import styles from './CreateEventPage.module.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Տվյալների ցուցակներ
const categoryOptions = [
  { value: 'Programming' }, { value: 'Business' }, { value: 'Music' },
  { value: 'Design' }, { value: 'Art' }, { value: 'Startup' },
  { value: 'AI & Tech' }, { value: 'Other' },
];

const addressOptions = [
  { value: 'Yerevan, Armenia' }, { value: 'Gyumri, Armenia' },
  { value: 'Vanadzor, Armenia' }, { value: 'Dilijan, Armenia' },
  { value: 'Tsaghkadzor, Armenia' }, { value: 'Goris, Armenia' },
];

const typeOptions = [{ value: 'Online' }, { value: 'Offline' }];

interface Props {
  images: { url: string; name: string }[];
  setImages: React.Dispatch<React.SetStateAction<{ url: string; name: string }[]>>;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  previewImage: string | null;
}

export default function CreateEventForm({ images, setImages, selectedIndex, setSelectedIndex, previewImage }: Props) {
  
  const handleUpload = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file && images.length < 3) {
      setImages(prev => [...prev, { url: URL.createObjectURL(file), name: file.name }]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (selectedIndex >= newImages.length) setSelectedIndex(0);
  };

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      
      {/* 1. Information Section + Validation */}
      <div className={styles.formCard}>
        <Title level={5} className={styles.cardHeader}>
          <InfoCircleOutlined className={styles.headerIcon} /> Event Information
        </Title>
        <Form.Item 
          label="Event Title" 
          name="title" 
          rules={[{ required: true, message: 'Please enter the event title' }]} 
          className={styles.compactItem}
        >
          <Input placeholder="AI Conference Armenia" className={styles.glassInput} />
        </Form.Item>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item 
              label="Category" 
              name="category" 
              rules={[{ required: true, message: 'Select a category' }]} 
              className={styles.compactItem}
            >
              <AutoComplete options={categoryOptions} filterOption={true}>
                <Input placeholder="Select or type..." className={styles.glassInput} />
              </AutoComplete>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Event Type" 
              name="eventType" 
              rules={[{ required: true, message: 'Select type' }]} 
              className={styles.compactItem}
            >
              <AutoComplete options={typeOptions} filterOption={true}>
                <Input placeholder="Online/Offline" className={styles.glassInput} />
              </AutoComplete>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item 
          label="Description" 
          name="description" 
          rules={[{ required: true, message: 'Please provide a description' }]} 
          className={styles.compactItem}
        >
          <TextArea rows={2} placeholder="Event details..." className={styles.glassInput} />
        </Form.Item>
      </div>

      {/* 2. Date & Location + Validation */}
      <div className={styles.formCard}>
        <Title level={5} className={styles.cardHeader}>
          <CalendarOutlined className={styles.headerIcon} /> Date & Location
        </Title>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item name="startDate" rules={[{ required: true, message: '' }]} className={styles.compactItem}>
              <DatePicker placeholder="Start Date" className={styles.glassInput} style={{width:'100%'}}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="startTime" rules={[{ required: true, message: '' }]} className={styles.compactItem}>
              <TimePicker placeholder="Time" format="HH:mm" className={styles.glassInput} style={{width:'100%'}}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="endDate" rules={[{ required: true, message: '' }]} className={styles.compactItem}>
              <DatePicker placeholder="End Date" className={styles.glassInput} style={{width:'100%'}}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="endTime" rules={[{ required: true, message: '' }]} className={styles.compactItem}>
              <TimePicker placeholder="Time" format="HH:mm" className={styles.glassInput} style={{width:'100%'}}/>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item 
          name="venue" 
          rules={[{ required: true, message: 'Venue name is required' }]} 
          className={styles.compactItem}
        >
          <Input prefix={<EnvironmentOutlined />} placeholder="Venue (e.g. TUMO Center)" className={styles.glassInput} />
        </Form.Item>
        <Form.Item 
          name="address" 
          rules={[{ required: true, message: 'Please select or type an address' }]} 
          className={styles.compactItem}
        >
          <AutoComplete options={addressOptions} filterOption={true}>
            <Input prefix={<EnvironmentOutlined />} placeholder="Address or City" className={styles.glassInput} />
          </AutoComplete>
        </Form.Item>
      </div>

      {/* 3. Organizer & Tickets + URL Validation */}
      <div className={styles.formCard}>
        <Title level={5} className={styles.cardHeader}>
          <UserOutlined className={styles.headerIcon} /> Organizer & Tickets
        </Title>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="organizer" rules={[{ required: true, message: 'Organizer is required' }]} className={styles.compactItem}>
              <Input prefix={<UserOutlined />} placeholder="Tech Armenia" className={styles.glassInput} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="ticket_url" 
              rules={[{ type: 'url', message: 'Enter a valid URL' }]} 
              className={styles.compactItem}
            >
              <Input prefix={<LinkOutlined />} placeholder="Ticket Link (Optional)" className={styles.glassInput} />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* 4. Images */}
      <div className={styles.formCard}>
        <Title level={5} className={styles.cardHeader}>
          <InboxOutlined className={styles.headerIcon} /> Event Images ({images.length}/3)
        </Title>
        {images.length < 3 && (
          <Upload.Dragger className={styles.glassUpload} showUploadList={false} beforeUpload={() => false} onChange={handleUpload} accept="image/*">
            <p className="ant-upload-drag-icon"><InboxOutlined style={{color: '#c08b46'}}/></p>
            <Text style={{color: 'white', fontSize: '12px'}}>Add Image</Text>
          </Upload.Dragger>
        )}
        <div className={styles.imageGrid}>
          {images.map((img, index) => (
            <div key={index} className={`${styles.imageItem} ${selectedIndex === index ? styles.selectedImage : ''}`} onClick={() => setSelectedIndex(index)}>
              <img src={img.url} alt="event" />
              <DeleteOutlined className={styles.imageDeleteIcon} onClick={(e) => { e.stopPropagation(); removeImage(index); }} />
            </div>
          ))}
        </div>
      </div>
    </Space>
  );
}