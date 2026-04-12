/**
 * Login Page Tests
 */

// Mock the api module BEFORE any imports
jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    verify: jest.fn(),
  },
  getToken: jest.fn(() => null),
  getRefreshToken: jest.fn(() => null),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router';

// Mock hooks
jest.mock('../hooks/AuthContext');
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

// Mock components
jest.mock('../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, variant, className }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('../components/ui/input', () => ({
  Input: ({ value, onChange, type, placeholder, disabled }: any) => (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      data-testid={`input-${type}`}
    />
  ),
}));

jest.mock('../components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('../components/ui/alert', () => ({
  Alert: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('lucide-react', () => ({
  BookOpen: () => <span data-testid="book-open-icon" />,
  AlertCircle: () => <span data-testid="alert-circle-icon" />,
}));

describe('Login Page', () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
      isAuthenticated: false,
    });
  });

  describe('Rendering', () => {
    it('renders login page title', () => {
      render(<Login />);
      expect(screen.getByText('UniLibrary')).toBeInTheDocument();
    });

    it('renders email input field', () => {
      render(<Login />);
      const emailInput = screen.getByPlaceholderText('your.email@university.edu');
      expect(emailInput).toBeInTheDocument();
    });

    it('renders password input field', () => {
      render(<Login />);
      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toBeInTheDocument();
    });

    it('renders login button', () => {
      render(<Login />);
      const buttons = screen.getAllByText('Login');
      expect(buttons.length).toBeGreaterThan(0); // At least one Login button
    });

    it('renders demo login button', () => {
      render(<Login />);
      expect(screen.getByText(/Demo Login/)).toBeInTheDocument();
    });

    it('displays demo credentials information', () => {
      render(<Login />);
      expect(screen.getByText('demo@example.com')).toBeInTheDocument();
      expect(screen.getByText('demo123')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when provided by auth context', () => {
      (useAuth as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: 'Invalid email or password',
        clearError: mockClearError,
        isAuthenticated: false,
      });

      render(<Login />);
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('disables inputs when loading', () => {
      (useAuth as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: true,
        error: null,
        clearError: mockClearError,
        isAuthenticated: false,
      });

      render(<Login />);
      const emailInput = screen.getByPlaceholderText('your.email@university.edu');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });
  });

  describe('Authentication Actions', () => {
    it('submits email and password and navigates after successful login', async () => {
      render(<Login />);

      fireEvent.change(screen.getByTestId('input-email'), {
        target: { value: 'user@test.com' },
      });
      fireEvent.change(screen.getByTestId('input-password'), {
        target: { value: 'secret123' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Login' }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'secret123');
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('performs demo login and navigates to home', async () => {
      render(<Login />);

      fireEvent.click(screen.getByText(/Demo Login/));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('demo@example.com', 'demo123');
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
