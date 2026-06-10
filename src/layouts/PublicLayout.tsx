import { Outlet, useLocation } from 'react-router-dom';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AUTH_PATHS = ['/signin', '/signup', '/forgot-password', '/reset-password'];
const PAGES_WITH_OWN_FOOTER = ['/', '/favorites', '/contact', '/about', '/events/new', '/events'];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);
  const showLayoutFooter = !isAuthPage && !PAGES_WITH_OWN_FOOTER.includes(pathname);

  return (
    <>
      {!isAuthPage && <Header />}
      <main>
        <Outlet />
      </main>
      {showLayoutFooter && <Footer />}
    </>
  );
}
