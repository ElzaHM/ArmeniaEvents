import { useState } from 'react';
import { Typography, Row, Col, Form, Input, Button, Space, message } from 'antd';
import { 
  SendOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  ShareAltOutlined,
  FacebookFilled,
  InstagramOutlined,
  LinkedinFilled
} from '@ant-design/icons';
import styles from './ContactPage.module.css';
import { sendTelegramMessage } from './SendTelegramMessage';
import FooterContent from '../../components/home/FooterContent';
import '../../components/home/home.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function ContactPage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { name: string; email: string; message: string }) => {
    setIsSubmitting(true);

    try {
      await sendTelegramMessage(values.name, values.email, values.message);
      messageApi.success('Your message has been sent. We will get back to you soon.');
      form.resetFields();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={`${styles.pageWrapper} contact-page`}>
        <div className="mainContent">
          
          <div className={styles.heroHeader}>
            <Title className={styles.mainTitle}>
              Contact <span className={styles.goldText}>Us</span>
            </Title>
            <div className={styles.goldUnderline}></div>
            <Paragraph className={styles.heroSubtitle}>
              We're here to help! Reach out to us with any questions, feedback, or support requests.
            </Paragraph>
          </div>

          {/* --- Main Content --- */}
          <Row gutter={[32, 32]} align="stretch" className={styles.cardsRow}>
            
            {/* Left Side: Form */}
            <Col xs={24} lg={13}>
              <div className={`${styles.glassCard} glassBlur`}>
                <Title level={4} className={styles.cardHeaderTitle}>
                  <SendOutlined className={styles.goldIcon} rotate={-45} /> Send us a message
                </Title>
                <Paragraph className={styles.cardSubtitle}>
                  Fill out the form below and we will get back to you as soon as possible.
                </Paragraph>

                <Form form={form} layout="vertical" onFinish={onFinish} className={styles.customForm}>
                  <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                    <Input placeholder="Your Name" className={styles.glassInput} />
                  </Form.Item>
                  <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                    <Input placeholder="Your Email" className={styles.glassInput} />
                  </Form.Item>
                  <Form.Item name="message" rules={[{ required: true, message: 'Please enter your message' }]}>
                    <TextArea rows={4} placeholder="Your Message" className={styles.glassInput} />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SendOutlined rotate={-45} />}
                    className={styles.submitBtn}
                    block
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Send Message
                  </Button>
                </Form>
              </div>
            </Col>

            {/* Right Side: Contact Info */}
            <Col xs={24} lg={11}>
              <div className={`${styles.glassCard} glassBlur`}>
                <Title level={4} className={styles.cardHeaderTitle}>
                  <MailOutlined className={styles.goldIcon} /> Contact Information
                </Title>
                <Paragraph className={styles.cardSubtitle}>
                  You can also reach us through the following channels.
                </Paragraph>

                <div className={styles.infoList}>
                  {/* Email */}
                  <div className={styles.infoItem}>
                    <div className={styles.infoIconBox}><MailOutlined /></div>
                    <div className={styles.infoText}>
                      <Text className={styles.infoLabel}>Email</Text>
                      <Text className={styles.infoValue}>eventmeetupplatform.2026@gmail.com</Text>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className={styles.infoItem}>
                    <div className={styles.infoIconBox}><PhoneOutlined /></div>
                    <div className={styles.infoText}>
                      <Text className={styles.infoLabel}>Phone</Text>
                      <Text className={styles.infoValue}>+374 11 123456</Text>
                    </div>
                  </div>

                  {/* Address */}
                  <div className={styles.infoItem}>
                    <div className={styles.infoIconBox}><EnvironmentOutlined /></div>
                    <div className={styles.infoText}>
                      <Text className={styles.infoLabel}>Address</Text>
                      <Text className={styles.infoValue}>1 Republic Square, Yerevan 0010, Armenia</Text>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className={styles.infoItem}>
                    <div className={styles.infoIconBox}><ClockCircleOutlined /></div>
                    <div className={styles.infoText}>
                      <Text className={styles.infoLabel}>Business Hours</Text>
                      <Text className={styles.infoValue}>Mon - Fri: 9:00 AM - 6:00 PM</Text>
                      <Text className={styles.infoValue}>Sat - Sun: 10:00 AM - 4:00 PM</Text>
                    </div>
                  </div>

                  {/* Social */}
                  <div className={styles.infoItem}>
                    <div className={styles.infoIconBox}><ShareAltOutlined /></div>
                    <div className={styles.infoText}>
                      <Text className={styles.infoLabel}>Follow Us</Text>
                      <Space size={20} className={styles.socialIcons}>
                        <FacebookFilled />
                        <InstagramOutlined />
                        <LinkedinFilled />
                      </Space>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.footer}>
          <FooterContent />
        </div>
      </div>
    </>
  );
}