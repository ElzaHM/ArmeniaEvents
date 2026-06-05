import { Col, Row, Typography } from 'antd';
import { HeartFilled } from '@ant-design/icons';

import { QueryState } from '../../hooks/queries/query-state';
import { useFooterCategories } from '../../hooks/queries/useCategories';
import { useFooterQuickLinks } from '../../hooks/queries/useEvents';

import NewsletterSubscribe from './NewsletterSubscribe';
import styles from './FooterContent.module.css';

export default function FooterContent() {
  const quickLinksQuery = useFooterQuickLinks();
  const footerCategoriesQuery = useFooterCategories();

  const isLoading = quickLinksQuery.isLoading || footerCategoriesQuery.isLoading;
  const isError = quickLinksQuery.isError || footerCategoriesQuery.isError;
  const error = quickLinksQuery.error ?? footerCategoriesQuery.error;

  const quickLinks = quickLinksQuery.data;
  const footerCategories = footerCategoriesQuery.data;

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {quickLinks && footerCategories && (
        <section className={styles.section}>
          <div className="homeSection">
            <Row gutter={[32, 40]}>
              ...
              <Col xs={24} sm={8} md={24} lg={6}>
                <Typography.Title level={5} className={styles.columnTitle}>
                  Subscribe to our newsletter
                </Typography.Title>
  
                <Typography.Paragraph className={styles.newsletterText}>
                  Get the latest events delivered to your inbox.
                </Typography.Paragraph>
  
                <NewsletterSubscribe />
              </Col>
            </Row>
  
            <div className={styles.bottomBar}>
              <Typography.Text type="secondary">
                © 2026 Armenia Events. All rights reserved.
              </Typography.Text>
  
              <Typography.Text
                type="secondary"
                className={styles.madeWith}
              >
                Made with <HeartFilled className={styles.heart} /> in Armenia
              </Typography.Text>
            </div>
          </div>
        </section>
      )}
    </QueryState>
  );
}
