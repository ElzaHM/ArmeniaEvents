import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button, Layout } from 'antd';
import {
  CloseOutlined,
  EnvironmentFilled,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import './Header.css';
import '../home/homeActionButton.css';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { pathname } = useLocation();
  const { mode, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink to="/events" className="nav-item" onClick={() => setMenuOpen(false)}>
            Events
          </NavLink>
          <NavLink to="/about" className="nav-item" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
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
          <Link to="/signin" className="header-signin-link">
            <Button className="signin-button homeActionBtn">Sign In</Button>
          </Link>
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
