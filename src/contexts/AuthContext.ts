import { createContext } from 'react';

// Define user type based on your token claims
export interface User {
  user_type: string;
  username: string;
  email: string;
  name: string;
  user_id: number;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);