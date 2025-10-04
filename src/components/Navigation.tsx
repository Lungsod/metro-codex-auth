import { ReactNode } from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import './Navigation.css';

export interface NavigationLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavigationProps {
  logo?: ReactNode;
  logoHref?: string;
  links?: NavigationLink[];
  onLoginClick?: () => void;
  className?: string;
}

export const Navigation = ({ 
  logo, 
  logoHref = '/', 
  links = [], 
  onLoginClick,
  className = ''
}: NavigationProps) => {
  return (
    <nav className={`codex-auth-navigation ${className}`}>
      <div className="codex-auth-nav-container">
        {/* Logo Section */}
        <div className="codex-auth-nav-logo">
          {logoHref ? (
            <a href={logoHref} className="codex-auth-logo-link">
              {logo}
            </a>
          ) : (
            logo
          )}
        </div>

        {/* Links Section */}
        <div className="codex-auth-nav-links">
          {links.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              className={`codex-auth-nav-link ${link.active ? 'active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Profile Section */}
        <div className="codex-auth-nav-profile">
          <ProfileDropdown onLoginClick={onLoginClick} />
        </div>
      </div>
    </nav>
  );
};