/**
 * Login Page Tests
 */

jest.mock('../../app/services/api', () => ({
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
import Login from '../../app/pages/Login';
import { useAuth } from '../../app/hooks/AuthContext';
import { useNavigate } from 'react-router';

jest.mock('../../app/hooks/AuthContext');
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../app/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, variant, className }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('../../app/components/ui/input', () => ({
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

jest.mock('../../app/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('../../app/components/ui/alert', () => ({
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
      expect(screen.getByPlaceholderText('your.email@university.edu')).toBeInTheDocument();
    });

    it('renders password input field', () => {
      render(<Login />);
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('renders login button', () => {
      render(<Login />);
      expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
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
      expect(screen.getByPlaceholderText('your.email@university.edu')).toBeDisabled();
      expect(screen.getByPlaceholderText('••••••••')).toBeDisabled();
    });
  });

  describe('Authentication Actions', () => {
    it('submits email and password and navigates after successful login', async () => {
      render(<Login />);

      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'user@test.com' } });
      fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } });
      fireEvent.click(screen.getByRole('button', { name: 'Login' }));

      await waitFor(() => { expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'secret123'); });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('performs demo login and navigates to home', async () => {
      render(<Login />);
      fireEvent.click(screen.getByText(/Demo Login/));
      await waitFor(() => { expect(mockLogin).toHaveBeenCalledWith('demo@example.com', 'demo123'); });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
