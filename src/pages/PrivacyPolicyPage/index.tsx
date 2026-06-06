import { Link } from 'react-router-dom';

import '../../components/home/home.css';
import styles from './PrivacyPolicyPage.module.css';

const sections = [
  {
    title: '1. Introduction',
    body:
      'Armenia Events ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services to discover and manage events in Armenia.',
  },
  {
    title: '2. Information We Collect',
    body:
      'We may collect your name, email address, account credentials, event preferences, newsletter subscription details, and technical data such as IP address, browser type, and usage logs when you browse or interact with the platform.',
  },
  {
    title: '3. How We Use Your Information',
    body:
      'We use your information to create and manage your account, provide event listings and recommendations, send service-related notifications, improve our platform, respond to support requests, and comply with legal obligations.',
  },
  {
    title: '4. Cookies and Analytics',
    body:
      'We may use cookies and similar technologies to remember your preferences, keep you signed in, and understand how visitors use our website. You can control cookies through your browser settings.',
  },
  {
    title: '5. Sharing of Information',
    body:
      'We do not sell your personal data. We may share limited information with trusted service providers (such as hosting, authentication, and email delivery partners) only as needed to operate Armenia Events, or when required by law.',
  },
  {
    title: '6. Data Security',
    body:
      'We apply reasonable technical and organizational measures to protect your data. However, no online service can guarantee absolute security, and you are responsible for keeping your password confidential.',
  },
  {
    title: '7. Your Rights',
    body:
      'You may request access to, correction of, or deletion of your personal data, and you may withdraw consent for optional communications such as newsletters. Contact us using the details below to exercise these rights.',
  },
  {
    title: '8. Children',
    body:
      'Armenia Events is not intended for children under 13. We do not knowingly collect personal information from children without appropriate consent.',
  },
  {
    title: '9. Changes to This Policy',
    body:
      'We may update this Privacy Policy from time to time. Continued use of the website after changes are posted means you accept the updated policy.',
  },
  {
    title: '10. Contact Us',
    body:
      'If you have questions about this Privacy Policy, contact us at privacy@armeniaevents.am or through the contact options available on our website.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className={`homeSection ${styles.container}`}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: June 2, 2026</p>
        <p className={styles.intro}>
          These general rules describe how Armenia Events handles your personal information when you browse events,
          create an account, subscribe to updates, or use our admin tools.
        </p>

        {sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p className={styles.sectionBody}>{section.body}</p>
          </section>
        ))}

        <Link to="/signup" className={styles.backLink}>
          Back to Sign Up
        </Link>
      </div>
    </div>
  );
}
