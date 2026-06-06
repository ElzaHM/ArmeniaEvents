import { Typography, Button } from 'antd';
import { 
  HeartFilled, EnvironmentOutlined, GlobalOutlined, 
  CalendarOutlined, ClockCircleOutlined, LinkOutlined, PlusCircleOutlined 
} from '@ant-design/icons';
import styles from './CreateEventPage.module.css';

const { Title, Text } = Typography;

export default function EventLivePreview({ data, image }: { data: any, image: string }) {
  return (
    <div className={styles.previewSticky}>
      <div className={styles.previewCard}>
        <Title level={5} className={styles.cardHeader}>
          <GlobalOutlined className={styles.headerIcon} /> Live Preview
        </Title>
        
        <div className={styles.eventPreviewBox}>
          <div 
            className={styles.previewImageArea} 
            style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%), url(${image})` }}
          >
            <div className={styles.categoryBadge}>{data.category}</div>
            <HeartFilled className={styles.previewHeart} />
            <div className={styles.dateBadge}>
              <Text className={styles.badgeMonth}>WED</Text>
              <Text className={styles.badgeDay}>15</Text>
            </div>
            <div className={styles.imageOverlayText}>
               <Title level={4} className={styles.previewTitle}>{data.title}</Title>
               <Text className={styles.previewDesc}>{data.description}</Text>
            </div>
          </div>

          <div className={styles.previewDetails}>
            <div className={styles.detailLine}><EnvironmentOutlined /> {data.venue}</div>
            <div className={styles.detailLine}><GlobalOutlined /> {data.address}</div>
            <div className={styles.detailLine}><CalendarOutlined /> {data.date}</div>
            <div className={styles.detailLine}><ClockCircleOutlined /> {data.startTime} - {data.endTime}</div>
            <Button block className={styles.viewTicketsBtn}>View Tickets <LinkOutlined /></Button>
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <Button size="large" className={styles.cancelBtn}>Cancel</Button>
        {/* htmlType="submit" կապում է կոճակը Form-ի հետ */}
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusCircleOutlined />} 
          className={styles.submitBtn} 
          htmlType="submit" 
        >
          Create Event
        </Button>
      </div>
    </div>
  );
}