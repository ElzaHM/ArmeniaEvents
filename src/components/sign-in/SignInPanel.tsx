import React from 'react';
import { MapPin, Heart, Bell, Ticket } from 'lucide-react';
import { SignInForm } from './SignInForm';
import styles from './SignInPanel.module.css';

export const SignInPanel: React.FC = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.leftSection}>
        <div className={styles.logoBox}>
          <MapPin size={24} color="#C07D43" fill="#C07D43" />
        </div>
        
        <h1 className={styles.welcomeHeading}>
          Welcome Back <br />
          to <span className={styles.accentText}>Armenia Events</span>
        </h1>
        
        <p className={styles.desc}>
          Sign in to discover the best events, save your favorites, 
          and get personalized recommendations just for you.
        </p>

        <div className={styles.featureList}>
          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}><Heart size={18} /></div>
            <div>
              <div className={styles.featureTitle}>Save Favorites</div>
              <div className={styles.featureDesc}>Save events you love and never miss them.</div>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}><Bell size={18} /></div>
            <div>
              <div className={styles.featureTitle}>Smart Notifications</div>
              <div className={styles.featureDesc}>Get notified about events you care about.</div>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}><Ticket size={18} /></div>
            <div>
              <div className={styles.featureTitle}>Easy Access</div>
              <div className={styles.featureDesc}>Access your tickets and event details anytime.</div>
            </div>
          </div>
        </div>

        <div className={styles.illustration}>
           {/* SVG skyline here */}
           <svg viewBox="0 0 400 100" fill="none" stroke="rgba(192, 125, 67, 0.5)" strokeWidth="1">
              <path d="M0 80 L40 60 L80 80 L120 40 L160 70 L200 20 L240 70 L280 50 L320 80 L400 80" />
           </svg>
        </div>
      </div>

      <div className={styles.rightSection}>
        <SignInForm />
      </div>
    </div>
  );
};