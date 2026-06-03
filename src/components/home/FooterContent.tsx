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

import { FOOTER_CATEGORIES, FOOTER_QUICK_LINKS } from './mockData';

import styles from './FooterContent.module.css';

export default function FooterContent() {
  return (
    <section className={styles.section}>
      <div className="homeSection">
        <Row gutter={[16, 12]}>
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
              {FOOTER_QUICK_LINKS.map((link) => (
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
              {FOOTER_CATEGORIES.map((category) => (
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
              <Input placeholder="Your email address" type="email" size="middle" />
              <Button type="primary" size="middle" className="homeActionBtn">
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
  );
}
