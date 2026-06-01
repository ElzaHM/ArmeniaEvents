import React from 'react';

import Header from '../../components/Header/Header';
import { FooterContent } from '../../components/home';
import { SignInPanel } from '../../components/sign-in';
import '../../components/home/home.css';
import '../../components/sign-in/sign-in.css';
import styles from '../../components/sign-in/SignInPage.module.css';

const SignInPage: React.FC = () => {
  return (
    <div className={`${styles.pageWrapper} auth-page sign-in-page`}>
      <Header />
      <div className={styles.arcDecoration} />

      <main className={styles.mainContent}>
        <SignInPanel />
      </main>

      <FooterContent />
    </div>
  );
};

export default SignInPage;
