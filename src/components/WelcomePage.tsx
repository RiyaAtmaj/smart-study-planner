import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRight } from 'lucide-react';

interface WelcomePageProps {
  onComplete: (user: User) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.college) {
      onComplete({
        name: formData.name,
        email: formData.email,
        college: formData.college,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Welcome to StudyAI Planner</h2>
        <p>Enter your details to get started with your personalized study plan</p>
      </div>

      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="input"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="input"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="college">College/University</label>
            <input
              type="text"
              id="college"
              className="input"
              value={formData.college}
              onChange={(e) => handleChange('college', e.target.value)}
              placeholder="Enter your college name"
              required
            />
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <p>🔐 Your data is stored locally in your browser</p>
            <p>🤖 Powered by AI for optimal study planning</p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
            disabled={!formData.name || !formData.email || !formData.college}
          >
            Get Started
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomePage;