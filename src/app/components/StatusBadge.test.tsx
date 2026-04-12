import { render, screen, within } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

// Mock the Badge component
jest.mock('./ui/badge', () => ({
  Badge: ({ children, className }: any) => (
    <div data-testid="badge" className={className}>
      {children}
    </div>
  ),
}));

describe('StatusBadge', () => {
  describe('Available Status', () => {
    it('renders available status with correct label', () => {
      render(<StatusBadge status="available" />);

      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toHaveClass('bg-[#22C55E]', 'text-white');
    });

    it('applies correct background color for available status', () => {
      render(<StatusBadge status="available" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[#22C55E]');
    });

    it('applies correct text color for available status', () => {
      render(<StatusBadge status="available" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('text-white');
    });

    it('applies correct hover classes for available status', () => {
      render(<StatusBadge status="available" />);

      expect(screen.getByTestId('badge')).toHaveClass('hover:bg-[#22C55E]/90');
    });

    it('renders with all required available status classes', () => {
      render(<StatusBadge status="available" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[#22C55E]');
      expect(badge).toHaveClass('text-white');
      expect(badge).toHaveClass('hover:bg-[#22C55E]/90');
    });
  });

  describe('Borrowed Status', () => {
    it('renders borrowed status with correct label and styles', () => {
      render(<StatusBadge status="borrowed" />);

      expect(screen.getByText('Borrowed')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toHaveClass('bg-[#64748B]', 'text-white');
    });

    it('applies correct background color for borrowed status', () => {
      render(<StatusBadge status="borrowed" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[#64748B]');
    });

    it('applies correct hover classes for borrowed status', () => {
      render(<StatusBadge status="borrowed" />);

      expect(screen.getByTestId('badge')).toHaveClass('hover:bg-[#64748B]/90');
    });

    it('displays proper contrast with white text', () => {
      render(<StatusBadge status="borrowed" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('text-white');
    });
  });

  describe('Reserved Status', () => {
    it('renders reserved status with correct label', () => {
      render(<StatusBadge status="reserved" />);

      expect(screen.getByText('Reserved')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toHaveClass('bg-[#F59E0B]', 'text-white');
    });

    it('applies correct background color for reserved status', () => {
      render(<StatusBadge status="reserved" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[#F59E0B]');
    });

    it('applies correct hover classes for reserved status', () => {
      render(<StatusBadge status="reserved" />);

      expect(screen.getByTestId('badge')).toHaveClass('hover:bg-[#F59E0B]/90');
    });

    it('renders with all required reserved status classes', () => {
      render(<StatusBadge status="reserved" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-[#F59E0B]');
      expect(badge).toHaveClass('text-white');
      expect(badge).toHaveClass('hover:bg-[#F59E0B]/90');
    });
  });

  describe('Color Consistency', () => {
    it('uses consistent text color (white) for all statuses', () => {
      const statuses: Array<'available' | 'borrowed' | 'reserved'> = [
        'available',
        'borrowed',
        'reserved',
      ];

      statuses.forEach(status => {
        const { unmount } = render(<StatusBadge status={status} />);
        expect(screen.getByTestId('badge')).toHaveClass('text-white');
        unmount();
      });
    });

    it('uses different background colors for different statuses', () => {
      render(<StatusBadge status="available" />);
      const availableBadge = screen.getByTestId('badge');
      const availableClasses = availableBadge.className;

      expect(availableClasses).not.toContain('bg-[#64748B]');
      expect(availableClasses).not.toContain('bg-[#F59E0B]');
    });

    it('applies proper hover state for accessibility', () => {
      const statuses: Array<'available' | 'borrowed' | 'reserved'> = [
        'available',
        'borrowed',
        'reserved',
      ];

      statuses.forEach(status => {
        const { unmount } = render(<StatusBadge status={status} />);
        const badge = screen.getByTestId('badge');
        
        // All badges should have a hover class
        expect(badge.className).toMatch(/hover:/);
        unmount();
      });
    });
  });

  describe('Component Structure', () => {
    it('renders Badge component exactly once', () => {
      render(<StatusBadge status="available" />);

      const badges = screen.getAllByTestId('badge');
      expect(badges).toHaveLength(1);
    });

    it('renders text content directly inside badge', () => {
      render(<StatusBadge status="available" />);

      const badge = screen.getByTestId('badge');
      expect(badge.textContent).toBe('Available');
    });

    it('passes className prop to Badge component', () => {
      render(<StatusBadge status="borrowed" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('class');
      expect(badge.getAttribute('class')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles status updates correctly', () => {
      const { rerender } = render(<StatusBadge status="available" />);
      expect(screen.getByText('Available')).toBeInTheDocument();

      rerender(<StatusBadge status="borrowed" />);
      expect(screen.queryByText('Available')).not.toBeInTheDocument();
      expect(screen.getByText('Borrowed')).toBeInTheDocument();
    });

    it('maintains styling through re-renders', () => {
      const { rerender } = render(<StatusBadge status="available" />);
      const badge1 = screen.getByTestId('badge');
      expect(badge1).toHaveClass('text-white');

      rerender(<StatusBadge status="available" />);
      const badge2 = screen.getByTestId('badge');
      expect(badge2).toHaveClass('text-white');
    });

    it('properly identifies all color variations', () => {
      const testStatuses = [
        { status: 'available' as const, color: '#22C55E' },
        { status: 'borrowed' as const, color: '#64748B' },
        { status: 'reserved' as const, color: '#F59E0B' },
      ];

      testStatuses.forEach(({ status, color }) => {
        const { unmount } = render(<StatusBadge status={status} />);
        const badge = screen.getByTestId('badge');
        expect(badge.className).toContain(`bg-[${color}]`);
        unmount();
      });
    });
  });
});

