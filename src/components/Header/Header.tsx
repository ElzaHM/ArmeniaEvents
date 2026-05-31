import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { 
  EnvironmentFilled, 
  MoonOutlined, 
  SunOutlined 
} from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import './Header.css';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { mode, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AntHeader className={`custom-header ${scrolled ? 'scrolled' : ''} ${mode === 'light' ? 'light-mode' : ''}`}>
      <div className="header-content">
        <Link to="/" className="header-logo">
          <EnvironmentFilled className="logo-icon" />
          <span className="logo-text">Armenia Events</span>
        </Link>

        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>Home</NavLink>
          <NavLink to="/events" className="nav-item">Events</NavLink>
          <NavLink to="/about" className="nav-item">About</NavLink>
        </nav>

        <div className="header-actions">
          <Button 
            type="text" 
            className="theme-toggle"
            icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />} 
            onClick={toggleTheme} 
          />
          <Link to="/signin">
            <Button className="signin-button">Sign In</Button>
          </Link>
        </div>
      </div>
    </AntHeader>
  );
}
