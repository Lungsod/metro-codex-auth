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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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