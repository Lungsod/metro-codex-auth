import React, { useState } from 'react';
import { 
  AuthProvider, 
  Navigation, 
  LoginModal, 
  useAuth,
  Logo
} from '@smartmetro/codex-auth';

// Example usage in your Codex Home app
function CodexHomeApp() {
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { label: 'Digital Twin', href: '/twin' },
    { label: 'Insights', href: '/insights' },
  ];

  // Only show Manager for authenticated users
  if (isAuthenticated) {
    navLinks.push({ label: 'Manager', href: '/manager' });
  }

  const logo = <Logo height={40} />;

  return (
    <div>
      <Navigation
        logo={logo}
        logoHref="/"
        links={navLinks}
        onLoginClick={() => setShowLogin(true)}
      />
      
      <main style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>SMART METRO Codex Platform</h1>
          
          {isAuthenticated ? (
            <div>
              <h2>Welcome, {user?.name}!</h2>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
                <a href="/twin" style={{ 
                  display: 'block',
                  padding: '2rem',
                  border: '1px solid #646cff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#646cff',
                  minWidth: '200px'
                }}>
                  <h3>Digital Twin</h3>
                  <p>Access the digital twin simulation platform</p>
                </a>
                
                <a href="/insights" style={{ 
                  display: 'block',
                  padding: '2rem',
                  border: '1px solid #646cff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#646cff',
                  minWidth: '200px'
                }}>
                  <h3>Insights</h3>
                  <p>View analytics and insights dashboard</p>
                </a>
                
                <a href="/manager" style={{ 
                  display: 'block',
                  padding: '2rem',
                  border: '1px solid #7c4dff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#7c4dff',
                  minWidth: '200px'
                }}>
                  <h3>Manager</h3>
                  <p>Access administrative controls</p>
                </a>
              </div>
            </div>
          ) : (
            <div>
              <p>Please log in to access all Codex applications</p>
              <button 
                onClick={() => setShowLogin(true)}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#646cff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  marginTop: '1rem'
                }}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </main>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        logo={logo}
        title="SMART METRO Codex"
        subtitle="Sign in to access all Codex applications"
        onLoginSuccess={() => {
          console.log('User logged in successfully!');
          setShowLogin(false);
        }}
      />
    </div>
  );
}

// Root component that provides authentication
function App() {
  return (
    <AuthProvider apiBaseUrl="/manager">
      <CodexHomeApp />
    </AuthProvider>
  );
}

export default App;