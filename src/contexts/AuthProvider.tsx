import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthContext, type User } from './AuthContext';

export interface AuthProviderProps {
  children: ReactNode;
  apiBaseUrl?: string;
}

// Define the structure of your JWT token payload
interface TokenPayload {
  user_type: string;
  username: string;
  email: string;
  name: string;
  user_id: number;
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
}

// Cookie configuration
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  expires: 7
};

// Helper function to decode token and extract user info
const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return null;
    }
    
    return {
      user_type: decoded.user_type,
      username: decoded.username,
      email: decoded.email,
      name: decoded.name,
      user_id: decoded.user_id
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const AuthProvider = ({ children, apiBaseUrl = '/manager' }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate token with server and get updated user info
  const validateTokenWithServer = async (token: string): Promise<User | null> => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/accounts/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Return user data from server response
      return {
        user_id: response.data.id || response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        name: response.data.name || response.data.full_name || `${response.data.first_name || ''} ${response.data.last_name || ''}`.trim(),
        user_type: response.data.user_type || 'user'
      };
    } catch (error) {
      return null;
    }
  };

  // Check if user is already authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const accessToken = Cookies.get('access_token');
      
      if (accessToken) {
        // First check if token is valid locally (not expired)
        const tokenUserData = getUserFromToken(accessToken);
        
        if (tokenUserData) {
          // Token is valid locally, now validate with server and get updated info
          const serverUserData = await validateTokenWithServer(accessToken);
          
          if (serverUserData) {
            // Use server data as it's more up-to-date
            setIsAuthenticated(true);
            setUser(serverUserData);
          } else {
            // Server rejected token - clean up
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // Token is invalid or expired locally
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [apiBaseUrl]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/accounts/token/`, {
        username,
        password
      });

      const { access, refresh } = response.data;
      
      // Store tokens in cookies
      Cookies.set('access_token', access, COOKIE_OPTIONS);
      Cookies.set('refresh_token', refresh, COOKIE_OPTIONS);
      
      // Extract user info from access token
      const userData = getUserFromToken(access);
      
      if (userData) {
        setIsAuthenticated(true);
        setUser(userData);
        return true;
      } else {
        throw new Error('Invalid token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    // Remove cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    
    // Update state
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};