import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/LoginModal.css';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onLoginSuccess?: () => void;
}

export const LoginModal = ({ 
  isOpen, 
  onClose, 
  logo,
  title = "SMART METRO Codex",
  subtitle = "Sign in to access all Codex applications",
  onLoginSuccess
}: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        setUsername('');
        setPassword('');
        onClose();
        onLoginSuccess?.();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="codex-auth-modal-overlay" onClick={handleClose}>
      <div className="codex-auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="codex-auth-modal-close" onClick={handleClose}>
          &times;
        </button>
        
        <div className="codex-auth-modal-header">
          {logo && <div className="codex-auth-modal-logo">{logo}</div>}
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        
        {error && <div className="codex-auth-modal-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="codex-auth-modal-form">
          <div className="codex-auth-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="codex-auth-form-group">
            <label htmlFor="password">Password</label>
            <div className="codex-auth-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="codex-auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="codex-auth-modal-submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};