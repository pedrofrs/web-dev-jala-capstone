import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../app/components/StatusBadge';

jest.mock('../../app/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => (
    <div data-testid="badge" className={className}>
      {children}
    </div>
  ),
}));

describe('StatusBadge', () => {
  it('renders the available status with its specific label and color classes', () => {
    render(<StatusBadge status="available" />);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('Available');
    expect(badge).toHaveClass('bg-[#22C55E]', 'text-white', 'hover:bg-[#22C55E]/90');
  });

  it('renders the borrowed status with its specific label and color classes', () => {
    render(<StatusBadge status="borrowed" />);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('Borrowed');
    expect(badge).toHaveClass('bg-[#64748B]', 'text-white', 'hover:bg-[#64748B]/90');
  });

  it('renders the reserved status with its specific label and color classes', () => {
    render(<StatusBadge status="reserved" />);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('Reserved');
    expect(badge).toHaveClass('bg-[#F59E0B]', 'text-white', 'hover:bg-[#F59E0B]/90');
  });

  it('updates the badge correctly when the status property changes dynamically', () => {
    const { rerender } = render(<StatusBadge status="available" />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Available');
    expect(screen.getByTestId('badge')).toHaveClass('bg-[#22C55E]');

    rerender(<StatusBadge status="borrowed" />);
    expect(screen.getByTestId('badge')).toHaveTextContent('Borrowed');
    expect(screen.getByTestId('badge')).toHaveClass('bg-[#64748B]');
  });
});
