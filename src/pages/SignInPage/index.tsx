import React from 'react';
import { Button, Input, Space } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  MoonOutlined,
  XOutlined,
} from '@ant-design/icons';
import { MapPin, Send } from 'lucide-react';
import '../../components/sign-in/sign-in.css';
import styles from '../../components/sign-in/SignInPage.module.css';
import { SignInPanel } from '../../components/sign-in';


// export default function SignInPage() {
//     return <h1>Sign In Page</h1>;
//   }

  

  
  
  const SignInPage: React.FC = () => {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.arcDecoration} />
        
        {/* Header */}
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <MapPin size={20} color="#C07D43" />
            <span>Armenia Events</span>
          </div>
          
          <div className={styles.navLinks}>
            <a href="#">Home</a>
            <a href="#">Events</a>
            <a href="#">Categories</a>
            <a href="#">Favorites</a>
            <a href="#">About</a>
          </div>
  
          <div className={styles.navActions}>
            <MoonOutlined style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
            <Button className={styles.signInBtn}>Sign In</Button>
          </div>
        </nav>
  
        {/* Main Container */}
        <main className={styles.mainContent}>
          <SignInPanel />
        </main>
  
        {/* Footer */}
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
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                Get the latest events straight to your inbox.
              </p>
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
  
  export default SignInPage;  