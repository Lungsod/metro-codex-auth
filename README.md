# @smartmetro/codex-auth

A reusable authentication package for SMART METRO Codex applications, providing JWT-based authentication with React components and utilities.

## Features

- 🔐 JWT-based authentication with secure cookie storage
- 🎨 Pre-built UI components (Navigation, Login Modal, Profile Dropdown)
- 🚀 Framework agnostic (works with React, Next.js, Express.js)
- 📱 Responsive design with light/dark mode support
- 🔧 TypeScript support with full type definitions
- 🎯 Centralized authentication state management

## Installation

```bash
npm install @smartmetro/codex-auth
# or
yarn add @smartmetro/codex-auth
```

## Quick Start

### 1. Wrap your app with AuthProvider

```tsx
import React from 'react';
import { AuthProvider } from '@smartmetro/codex-auth';
import App from './App';

function Root() {
  return (
    <AuthProvider apiBaseUrl="/manager">
      <App />
    </AuthProvider>
  );
}

export default Root;
```

### 2. Add Navigation with Login Modal

```tsx
import React, { useState } from 'react';
import { Navigation, LoginModal, useAuth } from '@smartmetro/codex-auth';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { label: 'Digital Twin', href: '/twin' },
    { label: 'Insights', href: '/insights' },
    { label: 'Manager', href: '/manager', active: true },
  ];

  const logo = (
    <img src="/logo.svg" alt="SMART METRO" height="40" />
  );

  return (
    <div>
      <Navigation
        logo={logo}
        logoHref="/"
        links={navLinks}
        onLoginClick={() => setShowLogin(true)}
      />
      
      <main>
        {isAuthenticated ? (
          <h1>Welcome, {user?.name}!</h1>
        ) : (
          <h1>Please log in to continue</h1>
        )}
      </main>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        logo={logo}
        onLoginSuccess={() => {
          console.log('User logged in successfully!');
        }}
      />
    </div>
  );
}

export default App;
```

## API Reference

### AuthProvider

The main provider component that manages authentication state.

```tsx
interface AuthProviderProps {
  children: ReactNode;
  apiBaseUrl?: string; // Default: '/manager'
}
```

#### Props
- `children`: React components to wrap
- `apiBaseUrl`: Base URL for authentication API endpoints

### useAuth Hook

Access authentication state and methods.

```tsx
const { isAuthenticated, user, login, logout, isLoading } = useAuth();
```

#### Returns
- `isAuthenticated`: Boolean indicating if user is logged in
- `user`: User object with profile information
- `login(username, password)`: Function to authenticate user
- `logout()`: Function to log out user
- `isLoading`: Boolean indicating if auth check is in progress

### Navigation Component

A responsive navigation bar with logo, links, and profile dropdown.

```tsx
interface NavigationProps {
  logo?: ReactNode;
  logoHref?: string;
  links?: NavigationLink[];
  onLoginClick?: () => void;
  className?: string;
}

interface NavigationLink {
  label: string;
  href: string;
  active?: boolean;
}
```

### LoginModal Component

A modal dialog for user authentication.

```tsx
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  logo?: ReactNode;
  title?: string;
  subtitle?: string;
  onLoginSuccess?: () => void;
}
```

### ProfileDropdown Component

A dropdown showing user profile and logout option.

```tsx
interface ProfileDropdownProps {
  onLoginClick?: () => void;
}
```

## Usage in Different Frameworks

### Next.js App Router

```tsx
// app/layout.tsx
import { AuthProvider } from '@smartmetro/codex-auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider apiBaseUrl="/api/auth">
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// app/page.tsx
'use client';
import { Navigation, useAuth } from '@smartmetro/codex-auth';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div>
      <Navigation
        logo={<span>My App</span>}
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings' },
        ]}
      />
      <main>
        {isAuthenticated ? 'Welcome back!' : 'Please log in'}
      </main>
    </div>
  );
}
```

### Express.js Integration

```javascript
// Server-side authentication middleware
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.cookies.access_token;
  
  if (!token) {
    return res.redirect('/login?redirect=' + encodeURIComponent(req.path));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.redirect('/login?redirect=' + encodeURIComponent(req.path));
  }
}

// Protected route
app.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard', { user: req.user });
});
```

### React with Create React App

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '@smartmetro/codex-auth';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

## Cookie Configuration

The package automatically handles JWT storage in cookies with these settings:

- `secure`: `true` in production, `false` in development
- `sameSite`: `'strict'`
- `path`: `'/'`
- `expires`: 7 days

## API Endpoints Expected

Your backend should provide these endpoints:

- `POST {apiBaseUrl}/api/accounts/token/` - Login endpoint
- `GET {apiBaseUrl}/api/accounts/me/` - Get user profile
- `POST {apiBaseUrl}/api/accounts/token/refresh/` - Refresh token (optional)

### Login Response Format

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### User Profile Response Format

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "name": "John Doe",
  "user_type": "admin"
}
```

## Styling

The package includes CSS modules with CSS custom properties for theming. All styles are prefixed with `codex-auth-` to avoid conflicts.

### Custom Styling

You can override the default styles by targeting the CSS classes:

```css
.codex-auth-navigation {
  background-color: your-custom-color;
}

.codex-auth-modal-container {
  border-radius: your-custom-radius;
}
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes during development
npm run dev
```

## License

MIT

## Contributing

Please see our contributing guidelines and code of conduct.

## Support

For issues and questions, please use the GitHub issue tracker.