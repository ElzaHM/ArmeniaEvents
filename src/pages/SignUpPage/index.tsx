import React from 'react';

import Header from '../../components/Header/Header';
import { FooterContent } from '../../components/home';
import { SignUpPanel } from '../../components/sign-up';
import '../../components/home/home.css';
import '../../components/sign-in/sign-in.css';
import '../../components/sign-up/sign-up.css';
import styles from '../../components/sign-up/SignUpPage.module.css';

const SignUpPage: React.FC = () => {
  return (
    <div className={`${styles.pageWrapper} auth-page sign-up-page`}>
      <Header />
      <div className={styles.arcDecoration} />

      <main className={styles.mainContent}>
        <SignUpPanel />
      </main>

      <FooterContent />
    </div>
  );
};

export default SignUpPage;
