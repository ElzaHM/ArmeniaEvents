import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Layout } from 'antd';
import {
  CloseOutlined,
  EnvironmentFilled,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import './Header.css';
import '../home/homeActionButton.css';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { pathname } = useLocation();
  const { mode, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isCreateEventPage =
    pathname === '/events/new' || pathname.startsWith('/events/new/');
  const isEventsPage =
    !isCreateEventPage &&
    (pathname === '/events' ||
      (pathname.startsWith('/events/') && !pathname.startsWith('/events/new')));
  const isHomePage = pathname === '/';
  const isAboutPage = pathname === '/about' || pathname.startsWith('/about/');

  const navClass = (active: boolean) => (active ? 'nav-item active' : 'nav-item');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <AntHeader className={`custom-header ${scrolled ? 'scrolled' : ''} ${mode === 'light' ? 'light-mode' : ''}`}>
      <div className="header-content">
        <Link to="/" className="header-logo">
          <EnvironmentFilled className="logo-icon" />
          <span className="logo-text">Armenia Events</span>
        </Link>

        <nav className={`header-nav ${menuOpen ? 'header-nav--open' : ''}`}>
          <Link
            to="/"
            className={navClass(isHomePage)}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/events"
            className={navClass(isEventsPage)}
            onClick={() => setMenuOpen(false)}
          >
            Events
          </Link>
          <Link
            to="/events/new"
            className={navClass(isCreateEventPage)}
            onClick={() => setMenuOpen(false)}
          >
            Create Event
          </Link>
          <Link
            to="/about"
            className={navClass(isAboutPage)}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </nav>

        {menuOpen && (
          <button
            type="button"
            className="header-nav-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        )}

<div className="header-actions">
  <Button
    type="text"
    className="theme-toggle"
    icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
    onClick={toggleTheme}
  />

  {isAuthenticated ? (
    <Button
      className="signin-button homeActionBtn"
      onClick={() => void handleLogout()}
    >
      Log Out
    </Button>
  ) : (
    <Link to="/signin" className="header-signin-link">
      <Button className="signin-button homeActionBtn">
        Sign In
      </Button>
    </Link>
  )}

  <Button
    type="text"
    className="menu-toggle"
    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={menuOpen}
    icon={menuOpen ? <CloseOutlined /> : <MenuOutlined />}
    onClick={() => setMenuOpen((open) => !open)}
  />
</div>
      </div>
    </AntHeader>
  );
}
