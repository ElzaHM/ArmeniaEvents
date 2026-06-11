import { Typography, Button } from 'antd';
import { 
  HeartOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined, 
  PlusCircleOutlined,
  HomeOutlined // Վայրի համար
} from '@ant-design/icons';
import styles from './CreateEventPage.module.css';

const { Title, Text } = Typography;

export default function EventLivePreview({
  data,
  image,
  onCancel,
  submitLoading,
}: {
  data: Record<string, string>;
  image: string;
  onCancel?: () => void;
  submitLoading?: boolean;
}) {
  const isFree = !data.price || data.price === 'Free' || data.price === '0';

  return (
    <div className={styles.previewSticky}>
      <Title level={5} className={styles.previewSectionTitle}>Live Preview</Title>
      
      <div className={styles.eventCardPreview}>
        <div 
          className={styles.previewImageArea} 
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className={styles.dateBadge}>
            <span className={styles.badgeMonth}>MAY</span>
            <span className={styles.badgeDay}>24</span>
          </div>
          <div className={styles.heartCircle}><HeartOutlined /></div>
        </div>

        <div className={styles.previewContent}>
          <Title level={4} className={styles.previewTitle}>{data.title}</Title>
          <Text className={styles.previewCategory}>{data.category}</Text>

          {/* Venue (Վայրի անուն) */}
          <div className={styles.detailRow}>
            <HomeOutlined className={styles.detailIcon} />
            <Text className={styles.detailText}>{data.venue}</Text>
          </div>

          {/* Address (Հասցե) */}
          <div className={styles.detailRow}>
            <EnvironmentOutlined className={styles.detailIcon} />
            <Text className={styles.detailText}>{data.address}</Text>
          </div>

          {/* Date & Time */}
          <div className={styles.detailRow}>
            <CalendarOutlined className={styles.detailIcon} />
            <Text className={styles.detailText}>{data.date} • {data.startTime}</Text>
          </div>

          <div className={`${styles.previewPrice} ${isFree ? styles.freePrice : ''}`}>
            {isFree ? 'Free' : `$${data.price}`}
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <Button size="large" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          icon={<PlusCircleOutlined />}
          className={styles.submitBtn}
          htmlType="submit"
          loading={submitLoading}>
          Create Event
        </Button>
      </div>
    </div>
  );
}