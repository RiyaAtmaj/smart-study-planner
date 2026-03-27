import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: User, token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple authentication - accept any email/password
    const user = {
      id: 1,
      name: isLogin ? 'User' : name,
      email: email
    };
    const token = 'dummy-token-' + Date.now();

    onAuthSuccess(user, token);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <p>{isLogin ? 'Access your plan settings and sync state.' : 'Create a new account to save plans.'}</p>
      </div>

      <div className="card" style={{ maxWidth: '420px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
          <button className="btn btn-secondary" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
