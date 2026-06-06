import { Outlet, useLocation } from 'react-router-dom';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AUTH_PATHS = ['/signin', '/signup', '/forgot-password', '/reset-password'];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  return (
    <>
      {!isAuthPage && <Header />}
      <main>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
