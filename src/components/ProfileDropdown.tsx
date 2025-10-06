import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/ProfileDropdown.css';

export interface ProfileDropdownProps {
  onLoginClick?: () => void;
}

export const ProfileDropdown = ({ onLoginClick }: ProfileDropdownProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleLogin = () => {
    onLoginClick?.();
  };

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <button className="codex-auth-profile-avatar" onClick={handleLogin}>
      </button>
    );
  }

  return (
    <div className="codex-auth-profile-dropdown" ref={dropdownRef}>
      <button 
        className="codex-auth-profile-button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="codex-auth-profile-avatar">
          {getInitials(user?.name || user?.username || 'U')}
        </div>
        <svg 
          className={`codex-auth-dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
          fill="none"
        >
          <path 
            d="M3 4.5L6 7.5L9 4.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="codex-auth-dropdown-menu">
          <div className="codex-auth-dropdown-header">
            <div className="codex-auth-user-avatar">
              {getInitials(user?.name || user?.username || 'U')}
            </div>
            <div className="codex-auth-user-info">
              <div className="codex-auth-user-name">{user?.name || user?.username}</div>
              <div className="codex-auth-user-email">{user?.email}</div>
            </div>
          </div>
          
          <div className="codex-auth-dropdown-divider"></div>
          
          <div className="codex-auth-dropdown-content">
            <div className="codex-auth-user-detail">
              <span className="codex-auth-detail-label">Username:</span>
              <span className="codex-auth-detail-value">{user?.username}</span>
            </div>
            <div className="codex-auth-user-detail">
              <span className="codex-auth-detail-label">User Type:</span>
              <span className="codex-auth-detail-value">{user?.user_type}</span>
            </div>
            <div className="codex-auth-user-detail">
              <span className="codex-auth-detail-label">ID:</span>
              <span className="codex-auth-detail-value">{user?.user_id}</span>
            </div>
          </div>
          
          <div className="codex-auth-dropdown-divider"></div>
          
          <button 
            className="codex-auth-logout-button"
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M6 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};