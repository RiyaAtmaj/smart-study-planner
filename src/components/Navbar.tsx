import React from 'react';
import { RotateCcw } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data and start over?')) {
      onReset();
    }
  };

  return (
    <nav className="navbar">
      <h1>🎓 StudyAI Planner</h1>
      <button className="reset-btn" onClick={handleReset}>
        <RotateCcw size={16} />
        Reset
      </button>
    </nav>
  );
};

export default Navbar;