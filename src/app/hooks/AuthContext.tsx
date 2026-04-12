/**
 * Authentication Context - Manages user authentication state
 * Provides login, logout, and user information to the app
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authAPI, getToken, setTokens, clearTokens } from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  registrationNumber: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authAPI.verify();
          if (response.data && !response.error) {
            // In a real app, you'd get the full user data from the verify response
            // For now, we'll assume the user is authenticated
            setUser({
              id: '1',
              email: localStorage.getItem('userEmail') || '',
              name: localStorage.getItem('userName') || '',
              registrationNumber: '',
            });
          } else {
            clearTokens();
          }
        } catch (error) {
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        
        // Store tokens
        setTokens(accessToken, refreshToken);
        
        // Store user info in localStorage for retrieval on page refresh
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userName', userData.name);
        
        // Set user state
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          registrationNumber: userData.registrationNumber,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(email, password, name);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        
        setTokens(accessToken, refreshToken);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userName', userData.name);
        
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          registrationNumber: userData.registrationNumber,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear tokens and user state, even if logout API call fails
      clearTokens();
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
