import { useState } from 'react';
import toast from 'react-hot-toast';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (name.trim().length > 20) {
      toast.error('Name must be less than 20 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const user = await response.json();
      toast.success(`Welcome, ${user.name}! 🎮`);
      onLogin(user);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container container">
      <div className="login-card card">
        <div className="login-header">
          <h1 className="login-title">
            <span className="logo-icon">⭕</span>
            Tic-Tac-Toe
            <span className="logo-icon">❌</span>
          </h1>
          <p className="login-subtitle">Multiplayer Gaming Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Enter Your Name
            </label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="e.g., John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              autoFocus
              disabled={loading}
            />
            <small className="form-hint">
              Choose a unique name to track your stats
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Joining...
              </>
            ) : (
              'Start Playing'
            )}
          </button>
        </form>

        <div className="login-features">
          <div className="feature">
            <span className="feature-icon">🎮</span>
            <span className="feature-text">Play with friends</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Real-time gameplay</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Track your stats</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
