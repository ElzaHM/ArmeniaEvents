import React from 'react';
import { MapPin, Heart, Bell, User } from 'lucide-react';
import { SignUpForm } from './SignUpForm';
import styles from './SignUpPanel.module.css';
import signUpIllustration from '../../pages/SignUpPage/photo_2026-05-31_13-59-21.jpg';

export const SignUpPanel: React.FC = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.leftSection}>
        <div className={styles.logoBox}>
          <MapPin size={24} />
        </div>
        
        <h1 className={styles.joinHeading}>
          Join <br />
          <span className={styles.accentText}>Armenia Events</span>
        </h1>
        
        <p className={styles.desc}>
          Create an account to discover the best events, save your favorites, 
          and get personalized recommendations.
        </p>

        <div className={styles.featureList}>
          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}><MapPin size={18} /></div>
            <div>
              <div className={styles.featureTitle}>Discover Local Events</div>
              <div className={styles.featureDesc}>Find events happening near you.</div>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}><Heart size={18} /></div>
            <div>
              <div className={styles.featureTitle}>Save Favorites</div>
              <div className={styles.featureDesc}>Save events you love and never miss them.</div>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}><User size={18} /></div>
            <div>
              <div className={styles.featureTitle}>Personalized Recommendations</div>
              <div className={styles.featureDesc}>Get events tailored just for you.</div>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}><Bell size={18} /></div>
            <div>
              <div className={styles.featureTitle}>Smart Notifications</div>
              <div className={styles.featureDesc}>Get notified about events you care about.</div>
            </div>
          </div>
        </div>

        <div className={`${styles.illustration} auth-illustration`}>
          <div className="auth-illustration-image">
            <img
              src={signUpIllustration}
              alt="Armenia Events skyline illustration"
              className={styles.illustrationImage}
            />
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <SignUpForm />
      </div>
    </div>
  );
};