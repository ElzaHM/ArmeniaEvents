import React from 'react';

import Header from '../../components/Header/Header';
import { ResetPasswordForm } from '../../components/sign-in/ResetPasswordForm';
import '../../components/home/home.css';
import '../../components/sign-in/sign-in.css';
import styles from '../../components/sign-in/SignInPage.module.css';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className={`${styles.pageWrapper} auth-page sign-in-page`}>
      <Header />
      <div className={styles.arcDecoration} />

      <main className={`${styles.mainContent} sign-in-main`}>
        <div className={styles.simplePanel}>
          <ResetPasswordForm />
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
