import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserMenu } from '../../app/components/UserMenu';
import { useAuth } from '../../app/hooks/AuthContext';
import { useNavigate } from 'react-router';

jest.mock('../../app/hooks/AuthContext');
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

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

jest.mock('../../app/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className }: any) => (
    <button onClick={onClick} data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('../../app/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children, align }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div onClick={onClick} data-testid="dropdown-item">{children}</div>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
}));

jest.mock('../../app/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => <div className={className}>{children}</div>,
  AvatarFallback: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('lucide-react', () => ({
  LogOut: () => <span data-testid="logout-icon" />,
  Settings: () => <span data-testid="settings-icon" />,
  User: () => <span data-testid="user-icon" />,
}));

describe('UserMenu', () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    registrationNumber: 'REG123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  describe('Unauthenticated State', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({ user: null, logout: mockLogout, isAuthenticated: false });
    });

    it('renders login button when not authenticated', () => {
      render(<UserMenu />);
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('navigates to login when login button clicked', () => {
      render(<UserMenu />);
      fireEvent.click(screen.getByText('Login'));
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Authenticated State', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser, logout: mockLogout, isAuthenticated: true });
    });

    it('renders user avatar when authenticated', () => {
      render(<UserMenu />);
      expect(screen.getByText('TU')).toBeInTheDocument();
    });

    it('displays user information in dropdown', () => {
      render(<UserMenu />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText(/REG123/)).toBeInTheDocument();
    });

    it('shows profile, settings, and logout options', () => {
      render(<UserMenu />);
      const items = screen.getAllByTestId('dropdown-item');
      expect(items.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUser, logout: mockLogout, isAuthenticated: true });
    });

    it('navigates to settings when profile option clicked', () => {
      render(<UserMenu />);
      fireEvent.click(screen.getAllByTestId('dropdown-item')[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });

    it('calls logout when logout option clicked', async () => {
      mockLogout.mockResolvedValueOnce(undefined);
      render(<UserMenu />);
      fireEvent.click(screen.getAllByTestId('dropdown-item')[2]);
      await waitFor(() => { expect(mockLogout).toHaveBeenCalled(); });
    });

    it('navigates to login after logout', async () => {
      mockLogout.mockResolvedValueOnce(undefined);
      render(<UserMenu />);
      fireEvent.click(screen.getAllByTestId('dropdown-item')[2]);
      await waitFor(() => { expect(mockNavigate).toHaveBeenCalledWith('/login'); });
    });
  });
});
