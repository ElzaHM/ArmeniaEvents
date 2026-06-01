import { Button, Col, Input, Row, Typography } from 'antd';
import {
  EnvironmentOutlined,
  FacebookOutlined,
  HeartFilled,
  InstagramOutlined,
  SendOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { QueryState } from '../../hooks/queries/query-state';
import { useFooterCategories } from '../../hooks/queries/useCategories';
import { useFooterQuickLinks } from '../../hooks/queries/useEvents';

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
              <Col xs={24} md={10} lg={8}>
                <div className={styles.brand}>
                  <div className={styles.logo}>
                    <EnvironmentOutlined />
                    <span>Armenia Events</span>
                  </div>
                  <Typography.Paragraph className={styles.about}>
                    Discover the best events across Armenia — from tech meetups and business
                    conferences to music festivals and art exhibitions.
                  </Typography.Paragraph>
                  <div className={styles.social}>
                    <a href="#" aria-label="Facebook">
                      <FacebookOutlined />
                    </a>
                    <a href="#" aria-label="Instagram">
                      <InstagramOutlined />
                    </a>
                    <a href="#" aria-label="Telegram">
                      <SendOutlined />
                    </a>
                    <a href="#" aria-label="Twitter">
                      <TwitterOutlined />
                    </a>
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={8} md={7} lg={5}>
                <Typography.Title level={5} className={styles.columnTitle}>
                  Quick Links
                </Typography.Title>
                <ul className={styles.linkList}>
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </Col>

              <Col xs={12} sm={8} md={7} lg={5}>
                <Typography.Title level={5} className={styles.columnTitle}>
                  Categories
                </Typography.Title>
                <ul className={styles.linkList}>
                  {footerCategories.map((category) => (
                    <li key={category}>
                      <Link to="/events">{category}</Link>
                    </li>
                  ))}
                </ul>
              </Col>

              <Col xs={24} sm={8} md={24} lg={6}>
                <Typography.Title level={5} className={styles.columnTitle}>
                  Subscribe to our newsletter
                </Typography.Title>
                <Typography.Paragraph className={styles.newsletterText}>
                  Get the latest events delivered to your inbox.
                </Typography.Paragraph>
                <div className={styles.newsletterForm}>
                  <Input placeholder="Your email address" type="email" size="large" />
                  <Button type="primary" size="large">
                    Subscribe
                  </Button>
                </div>
              </Col>
            </Row>

            <div className={styles.bottomBar}>
              <Typography.Text type="secondary">© 2026 Armenia Events. All rights reserved.</Typography.Text>
              <Typography.Text type="secondary" className={styles.madeWith}>
                Made with <HeartFilled className={styles.heart} /> in Armenia
              </Typography.Text>
            </div>
          </div>
        </section>
      )}
    </QueryState>
  );
}
