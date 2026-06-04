import React from 'react';

import Header from '../../components/Header/Header';
import { SignInPanel } from '../../components/sign-in';
import '../../components/home/home.css';
import '../../components/sign-in/sign-in.css';
import styles from '../../components/sign-in/SignInPage.module.css';

const SignInPage: React.FC = () => {
  return (
    <div className={`${styles.pageWrapper} auth-page sign-in-page`}>
      <Header />
      <div className={styles.arcDecoration} />

      <main className={`${styles.mainContent} sign-in-main`}>
        <SignInPanel />
      </main>
    </div>
  );
};

export default SignInPage;
