import React from "react";
import {
  Form,
  Input,
  AutoComplete,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Typography,
  Space,
  Upload,
} from "antd";
import {
  InfoCircleOutlined,
  CalendarOutlined,
  InboxOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  FileImageOutlined,
  UserOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import styles from "./CreateEventPage.module.css";

const {Title, Text} = Typography;
const {TextArea} = Input;

const defaultCategoryOptions = [
  {value: "Programming"},
  {value: "Business"},
  {value: "Music"},
  {value: "AI & Tech"},
];
const addressOptions = [
  {value: "Yerevan, Armenia"},
  {value: "Gyumri, Armenia"},
  {value: "Dilijan, Armenia"},
];
const typeOptions = [{value: "Online"}, {value: "Offline"}];

interface Props {
  image: {url: string; name: string} | null;
  setImage: (img: {url: string; name: string} | null) => void;
  categoryOptions?: {value: string}[];
}

export default function CreateEventForm({
  image,
  setImage,
  categoryOptions = defaultCategoryOptions,
}: Props) {
  const handleUpload = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setImage({
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }
  };

  return (
    <Space orientation="vertical" size={12} style={{width: "100%"}}>
      {/* Information Section */}
      <div className={styles.formCard}>
        <Title level={5} className={styles.cardHeader}>
          <InfoCircleOutlined className={styles.headerIcon} /> Information
        </Title>
        <Form.Item
          label="Event Title"
          name="title"
          rules={[{required: true}]}
          className={styles.compactItem}>
          <Input placeholder="AI Conference" className={styles.glassInput} />
        </Form.Item>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{required: true}]}
              className={styles.compactItem}>
              <AutoComplete options={categoryOptions} filterOption={true}>
                <Input className={styles.glassInput} />
              </AutoComplete>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Event Type"
              name="eventType"
              rules={[{required: true}]}
              className={styles.compactItem}>
              <AutoComplete options={typeOptions} filterOption={true}>
                <Input className={styles.glassInput} />
              </AutoComplete>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Description"
          name="description"
          rules={[{required: true}]}
          className={styles.compactItem}>
          <TextArea rows={2} className={styles.glassInput} />
        </Form.Item>
      </div>

      {/* Date & Location Section */}
      <div className={styles.formCard}>
        <Title level={5} className={styles.cardHeader}>
          <CalendarOutlined className={styles.headerIcon} /> Date & Location
        </Title>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item name="startDate" rules={[{required: true}]} className={styles.compactItem}>
              <DatePicker className={styles.glassInput} style={{width: "100%"}} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="startTime" rules={[{required: true}]} className={styles.compactItem}>
              <TimePicker format="HH:mm" className={styles.glassInput} style={{width: "100%"}} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="endDate" className={styles.compactItem}>
              <DatePicker className={styles.glassInput} style={{width: "100%"}} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="endTime" className={styles.compactItem}>
              <TimePicker format="HH:mm" className={styles.glassInput} style={{width: "100%"}} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="venue" rules={[{required: true}]} className={styles.compactItem}>
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder="Venue"
            className={styles.glassInput}
          />
        </Form.Item>
        <Form.Item name="address" rules={[{required: true}]} className={styles.compactItem}>
          <AutoComplete options={addressOptions} filterOption={true}>
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder="Address"
              className={styles.glassInput}
            />
          </AutoComplete>
        </Form.Item>
      </div>

      {/* Organizer Section */}
      <div className={styles.formCard}>
        <Title level={5} className={styles.cardHeader}>
          <UserOutlined className={styles.headerIcon} /> Organizer
        </Title>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="organizer" rules={[{required: true}]} className={styles.compactItem}>
              <Input prefix={<UserOutlined />} className={styles.glassInput} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="ticket_url" rules={[{type: "url"}]} className={styles.compactItem}>
              <Input prefix={<LinkOutlined />} className={styles.glassInput} />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Single Image Upload Section */}
      <div className={styles.formCard}>
        <Title level={5} className={styles.cardHeader}>
          <InboxOutlined className={styles.headerIcon} /> Event Image
        </Title>

        {!image ? (
          <Upload.Dragger
            className={styles.glassUpload}
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUpload}
            accept="image/*">
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{color: "#c08b46"}} />
            </p>
            <Text style={{color: "white", fontSize: "12px"}}>Click or drag image to upload</Text>
          </Upload.Dragger>
        ) : (
          <div className={styles.uploadedFileBar}>
            <div className={styles.fileDetails}>
              <FileImageOutlined className={styles.fileIcon} />
              <div className={styles.fileText}>
                <Text strong style={{color: "white"}}>
                  {image.name}
                </Text>
                <Text style={{color: "rgba(255,255,255,0.45)", fontSize: "12px"}}>
                  Ready for preview
                </Text>
              </div>
            </div>
            <DeleteOutlined className={styles.deleteBtn} onClick={() => setImage(null)} />
          </div>
        )}
      </div>
    </Space>
  );
}
