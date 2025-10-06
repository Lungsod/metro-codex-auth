import * as React from 'react';
import logoImage from '../assets/logo.png';

export interface LogoProps {
  height?: number | string;
  width?: number | string;
  className?: string;
}

export const Logo = ({ height = 40, width = 'auto', className = '' }: LogoProps) => {
  return (
    <img 
      src={logoImage} 
      alt="SMART METRO Codex Logo" 
      height={height}
      width={width}
      className={className}
      style={{ display: 'block' }}
    />
  );
};
