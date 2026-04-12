import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinesWidget } from './FinesWidget';
import { Student } from '../lib/data';

// Mock components
jest.mock('./ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('./ui/button', () => ({
  Button: ({ children, className, onClick }: any) => (
    <button data-testid="button" className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
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
      expect(card).toHaveClass(
        'bg-gradient-to-br',
        'from-success/10',
        'to-success/5',
        'border-success/20'
      );
    });

    it('renders green success icon for no fines state', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);

      expect(screen.getByTestId('credit-card-icon')).toBeInTheDocument();
    });

    it('does not render pay button when no fines exist', () => {
      render(<FinesWidget student={mockStudentWithoutFines} />);

      const payButton = screen.queryByText('Pay Now');
      expect(payButton).not.toBeInTheDocument();
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
      expect(card).toHaveClass(
        'bg-gradient-to-br',
        'from-destructive/10',
        'to-destructive/5',
        'border-destructive/20'
      );
    });

    it('displays red alert icon for fines state', () => {
      render(<FinesWidget student={mockStudentWithFines} />);

      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
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

    it('displays information about daily fine rates', () => {
      render(<FinesWidget student={mockStudentWithFines} />);

      expect(screen.getByText('Overdue returns incur R$ 2.00 per day')).toBeInTheDocument();
    });

    it('renders card with appropriate padding and spacing', () => {
      render(<FinesWidget student={mockStudentWithFines} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('p-6');
    });
  });

  describe('Fine Amount Formatting', () => {
    it('formats small fine amounts correctly', () => {
      const studentSmallFine = { ...mockStudentWithoutFines, totalFines: 5.00 };
      render(<FinesWidget student={studentSmallFine} />);

      expect(screen.getByText('R$ 5.00')).toBeInTheDocument();
    });

    it('formats large fine amounts correctly', () => {
      const studentLargeFines = { ...mockStudentWithoutFines, totalFines: 1250.75 };
      render(<FinesWidget student={studentLargeFines} />);

      expect(screen.getByText('R$ 1250.75')).toBeInTheDocument();
    });

    it('renders correct fine amount with decimals', () => {
      const studentWithHighFines = { ...mockStudentWithoutFines, totalFines: 123.99 };
      render(<FinesWidget student={studentWithHighFines} />);

      expect(screen.getByText('R$ 123.99')).toBeInTheDocument();
    });

    it('handles zero fines correctly', () => {
      const studentZeroFines = { ...mockStudentWithoutFines, totalFines: 0 };
      render(<FinesWidget student={studentZeroFines} />);

      expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();
    });

    it('displays very small decimal amounts', () => {
      const studentSmallDecimal = { ...mockStudentWithoutFines, totalFines: 0.50 };
      render(<FinesWidget student={studentSmallDecimal} />);

      expect(screen.getByText('R$ 0.50')).toBeInTheDocument();
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
      expect(screen.queryByText('Outstanding Fines')).not.toBeInTheDocument();

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

    it('updates fine amount when student data changes', () => {
      const { rerender } = render(
        <FinesWidget student={{ ...mockStudentWithoutFines, totalFines: 25.00 }} />
      );
      
      expect(screen.getByText('R$ 25.00')).toBeInTheDocument();

      rerender(
        <FinesWidget student={{ ...mockStudentWithoutFines, totalFines: 50.75 }} />
      );
      
      expect(screen.queryByText('R$ 25.00')).not.toBeInTheDocument();
      expect(screen.getByText('R$ 50.75')).toBeInTheDocument();
    });
  });

  describe('Button Behavior', () => {
    it('renders pay button with correct classes and styling', () => {
      render(<FinesWidget student={mockStudentWithFines} />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('w-full', 'bg-destructive', 'hover:bg-destructive/90');
    });

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

  describe('Accessibility', () => {
    it('renders card with proper structure', () => {
      render(<FinesWidget student={mockStudentWithFines} />);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('p-6');
    });

    it('displays all required text information for user clarity', () => {
      render(<FinesWidget student={mockStudentWithFines} />);

      expect(screen.getByText('Outstanding Fines')).toBeInTheDocument();
      expect(screen.getByText('Overdue returns incur R$ 2.00 per day')).toBeInTheDocument();
      expect(screen.getByText('R$ 45.50')).toBeInTheDocument();
    });

    it('provides clear visual hierarchy with large amount display', () => {
      render(<FinesWidget student={mockStudentWithFines} />);

      const fineAmount = screen.getByText('R$ 45.50');
      expect(fineAmount).toHaveClass('text-4xl', 'font-bold', 'text-destructive');
    });

    it('provides informative text to guide user actions', () => {
      render(<FinesWidget student={mockStudentWithFines} />);

      expect(screen.getByText('Payment required before borrowing new books')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large fine amounts', () => {
      const studentVeryLargeFines = { ...mockStudentWithoutFines, totalFines: 9999.99 };
      render(<FinesWidget student={studentVeryLargeFines} />);

      expect(screen.getByText('R$ 9999.99')).toBeInTheDocument();
    });

    it('handles minimum positive fine amount', () => {
      const studentMinimumFine = { ...mockStudentWithoutFines, totalFines: 0.01 };
      render(<FinesWidget student={studentMinimumFine} />);

      expect(screen.getByText('R$ 0.01')).toBeInTheDocument();
    });

    it('maintains correct state during rapid updates', () => {
      const { rerender } = render(<FinesWidget student={mockStudentWithFines} />);
      
      rerender(<FinesWidget student={{ ...mockStudentWithFines, totalFines: 50.00 }} />);
      rerender(<FinesWidget student={{ ...mockStudentWithFines, totalFines: 100.00 }} />);
      rerender(<FinesWidget student={mockStudentWithoutFines} />);
      
      expect(screen.getByText('No Outstanding Fines')).toBeInTheDocument();
    });

    it('handles student data with all fields populated', () => {
      const fullStudent: Student = {
        ...mockStudentWithFines,
        department: 'Computer Science',
        enrollmentStatus: 'active',
        activeLoans: 5,
        reservedBooks: 2,
        wishlistBooks: 10,
      };
      
      render(<FinesWidget student={fullStudent} />);
      
      expect(screen.getByText('R$ 45.50')).toBeInTheDocument();
    });
  });
});

