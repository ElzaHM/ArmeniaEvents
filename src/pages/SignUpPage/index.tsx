import React from 'react';
import { Button, Input, Space } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  XOutlined,
} from '@ant-design/icons';
import { MapPin, Send } from 'lucide-react';

import { SignUpPanel } from '../../components/sign-up';
import '../../components/sign-up/sign-up.css';
import styles from '../../components/sign-up/SignUpPage.module.css';

const SignUpPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.arcDecoration} />

      <main className={styles.mainContent}>
        <SignUpPanel />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.logo} style={{ marginBottom: 20 }}>
              <MapPin size={20} color="#C07D43" />
              <span>Armenia Events</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>
              Your guide to the best events in Armenia. Discover, connect, and share amazing experiences.
            </p>
            <Space size="middle" style={{ marginTop: 20 }}>
              <FacebookOutlined style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
              <InstagramOutlined style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
              <Send size={18} color="rgba(255,255,255,0.6)" />
              <XOutlined style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
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
              <Input placeholder="Enter your email" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff' }} />
              <Button style={{ background: '#C07D43', border: 'none', color: '#fff' }}>Subscribe</Button>
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
