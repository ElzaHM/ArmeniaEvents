import React from 'react';
import { Button, Input, Space } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  XOutlined,
} from '@ant-design/icons';
import { MapPin, Send } from 'lucide-react';

import { SignUpPanel } from '../../components/sign-up';
import '../../components/home/home.css';
import '../../components/sign-in/sign-in.css';
import '../../components/sign-up/sign-up.css';
import styles from '../../components/sign-up/SignUpPage.module.css';

const SignUpPage: React.FC = () => {
  return (
    <div className={`${styles.pageWrapper} auth-page sign-up-page`}>
      <div className={styles.arcDecoration} />

      <main className={styles.mainContent}>
        <SignUpPanel />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={`${styles.logo} ${styles.logoBrand}`}>
              <MapPin size={20} className={styles.logoIcon} />
              <span>Armenia Events</span>
            </div>
            <p className={styles.footerDesc}>
              Your guide to the best events in Armenia. Discover, connect, and share amazing experiences.
            </p>
            <Space size="middle" className={styles.footerSocial}>
              <FacebookOutlined className={styles.footerSocialIcon} />
              <InstagramOutlined className={styles.footerSocialIcon} />
              <Send size={18} className={styles.footerSocialIcon} />
              <XOutlined className={styles.footerSocialIcon} />
            </Space>
          </div>

          <div>
            <div className={styles.footerTitle}>Quick Links</div>
            <ul className={styles.footerList}>
              <li>Events</li>
              <li>Categories</li>
              <li>Favorites</li>
              <li>About Us</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <div className={styles.footerTitle}>Categories</div>
            <ul className={styles.footerList}>
              <li>Programming</li>
              <li>Business</li>
              <li>Music</li>
              <li>Design</li>
              <li>Startup</li>
              <li>AI & Tech</li>
            </ul>
          </div>

          <div>
            <div className={styles.footerTitle}>Subscribe to our newsletter</div>
            <div className={styles.newsletterInput}>
              <Input placeholder="Enter your email" className={styles.newsletterField} />
              <Button className={styles.subscribeBtn}>Subscribe</Button>
            </div>
          </div>
        </div>
        <div className={styles.bottomBar}>
          <div>© 2024 Armenia Events. All rights reserved.</div>
          <div>Made with ❤️ in Armenia →</div>
        </div>
      </footer>
    </div>
  );
};

export default SignUpPage;
