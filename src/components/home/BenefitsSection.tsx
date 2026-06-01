import { Col, Row, Typography } from 'antd';
import {
  BellOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useBenefits } from '../../hooks/queries/useEvents';

import styles from './BenefitsSection.module.css';

const benefitIcons = {
  environment: EnvironmentOutlined,
  heart: HeartOutlined,
  bell: BellOutlined,
  share: ShareAltOutlined,
} as const;

export default function BenefitsSection() {
  const { data: benefits, isLoading, isError, error } = useBenefits();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {benefits && (
        <section className={styles.section}>
          <div className="homeSection">
            <Row gutter={[32, 32]}>
              {benefits.map((benefit) => {
                const Icon = benefitIcons[benefit.icon];

                return (
                  <Col key={benefit.id} xs={24} sm={12} lg={6}>
                    <article className={styles.item}>
                      <Icon className={styles.icon} />
                      <Typography.Title level={5} className={styles.title}>
                        {benefit.title}
                      </Typography.Title>
                      <Typography.Paragraph className={styles.description}>
                        {benefit.description}
                      </Typography.Paragraph>
                    </article>
                  </Col>
                );
              })}
            </Row>
          </div>
        </section>
      )}
    </QueryState>
  );
}
