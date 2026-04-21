import { render, screen } from '@testing-library/react';
import { FinesWidget } from './FinesWidget';
import { Student } from '../lib/data';

jest.mock('./ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
}));

jest.mock('./ui/button', () => ({
  Button: ({ children, onClick }: any) => (
      <button data-testid="button" onClick={onClick}>
        {children}
      </button>
  ),
}));

jest.mock('lucide-react', () => ({
  AlertCircle: () => <span data-testid="alert-circle-icon" />,
  CreditCard: () => <span data-testid="credit-card-icon" />,
}));

describe('FinesWidget', () => {
  const baseStudent: Student = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@university.edu',
    registrationNumber: 'REG123',
    enrollmentStatus: 'active',
    totalFines: 0,
    activeLoans: 0,
    reservedBooks: 0,
    wishlistBooks: 0,
  };

  it('renders the good standing state when the student has no fines', () => {
    render(<FinesWidget student={{ ...baseStudent, totalFines: 0 }} />);

    expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();
    expect(screen.getByText('Your account is in good standing')).toBeInTheDocument();
    expect(screen.queryByTestId('button')).not.toBeInTheDocument();
  });

  it('renders the outstanding fines state and action button when the student has fines', () => {
    render(<FinesWidget student={{ ...baseStudent, totalFines: 45.5 }} />);

    expect(screen.getByText('Outstanding Fines')).toBeInTheDocument();
    expect(screen.getByText('Payment required before borrowing new books')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toHaveTextContent('Pay Now');
  });

  it('formats the fine amount correctly with two decimal places', () => {
    render(<FinesWidget student={{ ...baseStudent, totalFines: 123.4 }} />);

    expect(screen.getByText('R$ 123.40')).toBeInTheDocument();
  });

  it('transitions between good standing and outstanding fines states when data updates', () => {
    const { rerender } = render(<FinesWidget student={{ ...baseStudent, totalFines: 0 }} />);

    expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();

    rerender(<FinesWidget student={{ ...baseStudent, totalFines: 10 }} />);

    expect(screen.getByText('Outstanding Fines')).toBeInTheDocument();
    expect(screen.getByText('R$ 10.00')).toBeInTheDocument();
  });

  it('treats minimum positive fractional amounts as outstanding fines', () => {
    render(<FinesWidget student={{ ...baseStudent, totalFines: 0.01 }} />);

    expect(screen.getByText('Outstanding Fines')).toBeInTheDocument();
    expect(screen.getByText('R$ 0.01')).toBeInTheDocument();
  });
});