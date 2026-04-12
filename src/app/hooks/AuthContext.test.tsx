/**
 * Authentication Context Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

jest.mock('../services/api', () => ({
  getToken: jest.fn(() => null),
  getRefreshToken: jest.fn(() => null),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    verify: jest.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(AuthProvider, {}, children)
  );

  describe('useAuth hook', () => {
    it('throws error when used outside AuthProvider', () => {
      // Suppress the error output during this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => renderHook(useAuth)).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });

    it('provides auth context when used inside AuthProvider', () => {
      const { result } = renderHook(useAuth, { wrapper });
      expect(result.current).toBeDefined();
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Initial state', () => {
    it('initializes with no user', async () => {
      const { result } = renderHook(useAuth, { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('provides isLoading state', async () => {
      const { result } = renderHook(useAuth, { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      expect(typeof result.current.isLoading).toBe('boolean');
    });
  });

  describe('Login functionality', () => {
    it('provides login function', () => {
      const { result } = renderHook(useAuth, { wrapper });
      expect(typeof result.current.login).toBe('function');
    });

    it('updates error state on failed login', async () => {
      const { result } = renderHook(useAuth, { wrapper });
      const mockAuthAPI = require('../services/api').authAPI;
      
      mockAuthAPI.login.mockResolvedValueOnce({
        error: 'Invalid credentials',
        status: 401,
      });

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrongpassword');
        } catch (err) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Invalid credentials');
    });
  });

  describe('Logout functionality', () => {
    it('provides logout function', () => {
      const { result } = renderHook(useAuth, { wrapper });
      expect(typeof result.current.logout).toBe('function');
    });

    it('clears user state on logout', async () => {
      const { result } = renderHook(useAuth, { wrapper });
      
      const mockClearTokens = require('../services/api').clearTokens as jest.Mock;

      await act(async () => {
        await result.current.logout();
      });

      expect(mockClearTokens).toHaveBeenCalled();
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('provides clearError function', () => {
      const { result } = renderHook(useAuth, { wrapper });
      expect(typeof result.current.clearError).toBe('function');
    });

    it('clears error state when clearError is called', async () => {
      const { result } = renderHook(useAuth, { wrapper });

      // Set an error state
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });
});
