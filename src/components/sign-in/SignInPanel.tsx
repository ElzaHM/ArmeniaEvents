import React from 'react';
import { MapPin, Heart, Bell, Ticket } from 'lucide-react';
import { SignInForm } from './SignInForm';
import styles from './SignInPanel.module.css';
import signInIllustration from '../../pages/SignInPage/photo_2026-05-31_13-59-21 (2).jpg';

export const SignInPanel: React.FC = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.leftSection}>
        <div className={styles.logoBox}>
          <MapPin size={24} />
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

        <div className={`${styles.illustration} auth-illustration`}>
          <div className="auth-illustration-image">
            <img
              src={signInIllustration}
              alt="Armenia Events skyline illustration"
              className={styles.illustrationImage}
            />
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <SignInForm />
      </div>
    </div>
  );
};