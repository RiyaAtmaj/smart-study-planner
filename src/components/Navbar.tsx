import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Sun, Moon, Home } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Navbar: React.FC<NavbarProps> = ({ onReset, onToggleTheme, theme }) => {
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data and start over?')) {
      onReset();
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>🎓 StudyAI Planner</h1>
      </Link>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="reset-btn">
            <Home size={16} />
            Home
          </button>
        </Link>
        <button className="reset-btn" onClick={onToggleTheme}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <button className="reset-btn" onClick={handleReset}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </nav>
  );
};

export default Navbar;