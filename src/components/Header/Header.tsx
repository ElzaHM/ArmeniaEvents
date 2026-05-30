import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { useTheme } from '../../hooks/useTheme';

export default function Header() {
  const { mode, toggleTheme } = useTheme();

  return (
    <header>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/events">Events</Link> |{' '}
        <Link to="/signin">Sign In</Link>

        <Button
          style={{ marginLeft: 20 }}
          onClick={toggleTheme}
        >
          {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </nav>
    </header>
  );
}