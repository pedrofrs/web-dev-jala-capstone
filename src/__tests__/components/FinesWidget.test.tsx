import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinesWidget } from '../../app/components/FinesWidget';
import { Student } from '../../app/lib/data';

jest.mock('../../app/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('../../app/components/ui/button', () => ({
  Button: ({ children, className, onClick }: any) => (
    <button data-testid="button" className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  AlertCircle: () => <span data-testid="alert-circle-icon" />,
  CreditCard: () => <span data-testid="credit-card-icon" />,
}));

describe('FinesWidget', () => {
  const mockStudentWithoutFines: Student = {
    id: '1',
    name: 'Test Student',
    email: 'test@university.edu',
    registrationNumber: 'REG123',
    enrollmentStatus: 'active',
    totalFines: 0,
    activeLoans: 3,
    reservedBooks: 1,
    wishlistBooks: 5,
  };

  const mockStudentWithFines: Student = {
    ...mockStudentWithoutFines,
    totalFines: 45.50,
  };

  describe('No Fines State', () => {
    it('renders no fines state when student has no outstanding fines', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);

      expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();
      expect(screen.getByText('Your account is in good standing')).toBeInTheDocument();
      expect(screen.getByTestId('credit-card-icon')).toBeInTheDocument();
    });

    it('displays correct message in no fines state', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);
      expect(screen.getByText('Your account is in good standing')).toBeInTheDocument();
    });

    it('applies correct styling for no fines state', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-gradient-to-br', 'from-success/10', 'to-success/5', 'border-success/20');
    });

    it('does not render pay button when no fines exist', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);
      expect(screen.queryByText('Pay Now')).not.toBeInTheDocument();
    });

    it('does not render alert icon for no fines state', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);
      expect(screen.queryByTestId('alert-circle-icon')).not.toBeInTheDocument();
    });

    it('does not display fine amount for zero fines', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);
      expect(screen.queryByText(/R\$/)).not.toBeInTheDocument();
    });
  });

  describe('Outstanding Fines State', () => {
    it('renders fines state when student has outstanding fines', () => {
      render(<FinesWidget student={mockStudentWithFines} />);
      expect(screen.getByText('Outstanding Fines')).toBeInTheDocument();
      expect(screen.getByText('Overdue returns incur R$ 2.00 per day')).toBeInTheDocument();
      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
    });

    it('displays correct fine amount formatting', () => {
      render(<FinesWidget student={mockStudentWithFines} />);
      expect(screen.getByText('R$ 45.50')).toBeInTheDocument();
    });

    it('applies correct styling for fines state', () => {
      render(<FinesWidget student={mockStudentWithFines} />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-gradient-to-br', 'from-destructive/10', 'to-destructive/5', 'border-destructive/20');
    });

    it('renders pay button when student has fines', () => {
      render(<FinesWidget student={mockStudentWithFines} />);
      const payButton = screen.getByTestId('button');
      expect(payButton).toHaveTextContent('Pay Now');
      expect(payButton).toHaveClass('w-full', 'bg-destructive', 'hover:bg-destructive/90');
    });

    it('displays payment warning message', () => {
      render(<FinesWidget student={mockStudentWithFines} />);
      expect(screen.getByText('Payment required before borrowing new books')).toBeInTheDocument();
    });
  });

  describe('Fine Amount Formatting', () => {
    it('formats small fine amounts correctly', () => {
      render(<FinesWidget student={{ ...mockStudentWithoutFines, totalFines: 5.00 }} />);
      expect(screen.getByText('R$ 5.00')).toBeInTheDocument();
    });

    it('formats large fine amounts correctly', () => {
      render(<FinesWidget student={{ ...mockStudentWithoutFines, totalFines: 1250.75 }} />);
      expect(screen.getByText('R$ 1250.75')).toBeInTheDocument();
    });

    it('handles zero fines correctly', () => {
      render(<FinesWidget student={{ ...mockStudentWithoutFines, totalFines: 0 }} />);
      expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();
    });

    it('maintains precision with two decimal places', () => {
      const testCases = [
        { amount: 10.99, expected: 'R$ 10.99' },
        { amount: 100.01, expected: 'R$ 100.01' },
        { amount: 999.50, expected: 'R$ 999.50' },
      ];

      testCases.forEach(({ amount, expected }) => {
        const { unmount } = render(
          <FinesWidget student={{ ...mockStudentWithoutFines, totalFines: amount }} />
        );
        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Dynamic Behavior', () => {
    it('switches from no fines to with fines when data updates', () => {
      const { rerender } = render(<FinesWidget student={mockStudentWithoutFines} />);
      expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();

      rerender(<FinesWidget student={mockStudentWithFines} />);
      expect(screen.queryByText('No Outstanding Fines')).not.toBeInTheDocument();
      expect(screen.getByText('Outstanding Fines')).toBeInTheDocument();
      expect(screen.getByText('R$ 45.50')).toBeInTheDocument();
    });

    it('switches from with fines to no fines when fines are paid', () => {
      const { rerender } = render(<FinesWidget student={mockStudentWithFines} />);
      expect(screen.getByText('R$ 45.50')).toBeInTheDocument();

      rerender(<FinesWidget student={{ ...mockStudentWithFines, totalFines: 0 }} />);
      expect(screen.queryByText('R$ 45.50')).not.toBeInTheDocument();
      expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();
    });
  });

  describe('Button Behavior', () => {
    it('pay button contains credit card icon', () => {
      render(<FinesWidget student={mockStudentWithFines} />);
      const button = screen.getByTestId('button');
      const creditCardIcon = within(button).getByTestId('credit-card-icon');
      expect(creditCardIcon).toBeInTheDocument();
    });

    it('pay button is clickable', async () => {
      render(<FinesWidget student={mockStudentWithFines} />);
      const button = screen.getByTestId('button');
      const user = userEvent.setup();
      await expect(user.click(button)).resolves.toBeUndefined();
    });

    it('does not show pay button when fines are zero', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);
      expect(screen.queryByTestId('button')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large fine amounts', () => {
      render(<FinesWidget student={{ ...mockStudentWithoutFines, totalFines: 9999.99 }} />);
      expect(screen.getByText('R$ 9999.99')).toBeInTheDocument();
    });

    it('handles minimum positive fine amount', () => {
      render(<FinesWidget student={{ ...mockStudentWithoutFines, totalFines: 0.01 }} />);
      expect(screen.getByText('R$ 0.01')).toBeInTheDocument();
    });

    it('maintains correct state during rapid updates', () => {
      const { rerender } = render(<FinesWidget student={mockStudentWithFines} />);
      rerender(<FinesWidget student={{ ...mockStudentWithFines, totalFines: 50.00 }} />);
      rerender(<FinesWidget student={{ ...mockStudentWithFines, totalFines: 100.00 }} />);
      rerender(<FinesWidget student={mockStudentWithoutFines} />);
      expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();
    });
  });
});
