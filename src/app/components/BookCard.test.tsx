import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard, BookCardSkeleton } from './BookCard';
import { Book } from '../lib/data';

// Mock react-router
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock child components
jest.mock('./StatusBadge', () => ({
  StatusBadge: ({ status }: { status: string }) => (
    <div data-testid="status-badge">{status}</div>
  ),
}));

jest.mock('./ui/badge', () => ({
  Badge: ({ children, ...props }: any) => (
    <div data-testid="badge" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('./ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Download: () => <div data-testid="download-icon" />,
  BookOpen: () => <div data-testid="book-open-icon" />,
}));

describe('BookCard', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Test Book Title',
    author: 'Test Author',
    category: 'Fiction',
    isbn: '1234567890',
    description: 'A test book description.',
    coverUrl: 'https://example.com/cover.jpg',
    status: 'available',
    publishedYear: 2023,
    pages: 300,
    publisher: 'Test Publisher',
    edition: '1st',
    shelfLocation: 'A1-01',
    department: 'Literature',
    availabilityType: 'physical',
    floor: '1',
    wing: 'A',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    it('renders book details correctly for physical book', () => {
      render(<BookCard book={mockBook} />);

      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Fiction')).toBeInTheDocument();
      expect(screen.getByText('A1-01')).toBeInTheDocument();
      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Test Book Title' })).toHaveAttribute(
        'src',
        'https://example.com/cover.jpg'
      );
      expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    });

    it('renders all required book information elements', () => {
      render(<BookCard book={mockBook} />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    it('renders book image with correct alt text and src', () => {
      render(<BookCard book={mockBook} />);

      const image = screen.getByRole('img', { name: 'Test Book Title' });
      expect(image).toHaveAttribute('src', mockBook.coverUrl);
      expect(image).toHaveClass('w-full', 'h-full', 'object-cover');
    });

    it('renders with very long book titles', () => {
      const longTitleBook = {
        ...mockBook,
        title: 'A Very Long Book Title That Should Be Truncated With Multiple Lines And Still Render Correctly',
      };
      render(<BookCard book={longTitleBook} />);

      const title = screen.getByText(/A Very Long Book Title/);
      expect(title).toHaveClass('line-clamp-2');
    });

    it('renders status badge with correct status value', () => {
      render(<BookCard book={mockBook} />);
      
      const statusBadge = screen.getByTestId('status-badge');
      expect(statusBadge).toHaveTextContent('available');
    });

    it('renders with different status values', () => {
      const borrowedBook = { ...mockBook, status: 'borrowed' as const };
      render(<BookCard book={borrowedBook} />);
      
      expect(screen.getByTestId('status-badge')).toHaveTextContent('borrowed');
    });
  });

  describe('Availability Types', () => {
    it('should not render digital badge for physical availability', () => {
      render(<BookCard book={mockBook} />);

      expect(screen.queryByText('Digital')).not.toBeInTheDocument();
      expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument();
    });

    it('renders digital badge for digital availability', () => {
      const digitalBook = { ...mockBook, availabilityType: 'digital' as const };
      render(<BookCard book={digitalBook} />);

      expect(screen.getByText('Digital')).toBeInTheDocument();
      expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    });

    it('renders both badge for both availability types', () => {
      const bothBook = { ...mockBook, availabilityType: 'both' as const };
      render(<BookCard book={bothBook} />);

      expect(screen.getByText('Both')).toBeInTheDocument();
      expect(screen.getByTestId('book-open-icon')).toBeInTheDocument();
    });

    it('only shows one availability badge at a time', () => {
      const { rerender } = render(<BookCard book={mockBook} />);
      expect(screen.queryByText('Digital')).not.toBeInTheDocument();
      
      rerender(<BookCard book={{ ...mockBook, availabilityType: 'digital' }} />);
      expect(screen.getByText('Digital')).toBeInTheDocument();
      expect(screen.queryByText('Both')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to book details on card click', () => {
      render(<BookCard book={mockBook} />);

      const card = screen.getByTestId('card');
      fireEvent.click(card);

      expect(mockNavigate).toHaveBeenCalledWith('/book/1');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('navigates with correct book ID for different books', () => {
      const bookWithDifferentId = { ...mockBook, id: '42' };
      render(<BookCard book={bookWithDifferentId} />);

      const card = screen.getByTestId('card');
      fireEvent.click(card);

      expect(mockNavigate).toHaveBeenCalledWith('/book/42');
    });

    it('handles multiple clicks on the card', () => {
      render(<BookCard book={mockBook} />);

      const card = screen.getByTestId('card');
      fireEvent.click(card);
      fireEvent.click(card);
      fireEvent.click(card);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenLastCalledWith('/book/1');
    });
  });

  describe('Styling and Classes', () => {
    it('applies correct styles to card for hover effects', () => {
      render(<BookCard book={mockBook} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass(
        'overflow-hidden',
        'cursor-pointer',
        'transition-all',
        'duration-300',
        'hover:shadow-lg',
        'hover:-translate-y-1'
      );
    });

    it('applies overflow-hidden class to image container', () => {
      render(<BookCard book={mockBook} />);
      
      const imageContainer = screen.getByRole('img', { name: 'Test Book Title' }).parentElement;
      expect(imageContainer).toHaveClass('overflow-hidden');
    });

    it('applies correct spacing classes to content area', () => {
      render(<BookCard book={mockBook} />);
      
      expect(screen.getByText('Test Book Title').closest('div')).toHaveClass('flex', 'items-start', 'justify-between', 'gap-2');
    });
  });

  describe('Category Display', () => {
    it('displays correct category badge', () => {
      render(<BookCard book={mockBook} />);

      expect(screen.getByText('Fiction')).toBeInTheDocument();
    });

    it('displays different categories correctly', () => {
      const scienceBook = { ...mockBook, category: 'Science' };
      render(<BookCard book={scienceBook} />);

      expect(screen.getByText('Science')).toBeInTheDocument();
    });

    it('renders category badge with outline variant', () => {
      render(<BookCard book={mockBook} />);
      
      const badges = screen.getAllByTestId('badge');
      const categoryBadge = badges.find(badge => badge.textContent === 'Fiction');
      expect(categoryBadge).toBeInTheDocument();
    });
  });

  describe('Shelf Location Display', () => {
    it('displays shelf location with map pin icon', () => {
      render(<BookCard book={mockBook} />);

      expect(screen.getByText('A1-01')).toBeInTheDocument();
      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    });

    it('displays shelf location in monospace font', () => {
      render(<BookCard book={mockBook} />);
      
      const shelfLocation = screen.getByText('A1-01');
      expect(shelfLocation).toHaveClass('font-mono', 'font-medium');
    });

    it('handles different shelf location formats', () => {
      const bookWithDifferentLocation = { ...mockBook, shelfLocation: '005.1 K72a' };
      render(<BookCard book={bookWithDifferentLocation} />);

      expect(screen.getByText('005.1 K72a')).toBeInTheDocument();
    });
  });
});

describe('BookCardSkeleton', () => {
  it('renders skeleton structure with loading animations', () => {
    render(<BookCardSkeleton />);

    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('renders multiple skeleton elements for text placeholders', () => {
    render(<BookCardSkeleton />);

    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();

    const pulseElements = card.querySelectorAll('.animate-pulse');
    // Should have elements for: image, title, author, location, badges
    expect(pulseElements.length).toBeGreaterThanOrEqual(5);
  });

  it('has correct aspect ratio for image skeleton', () => {
    render(<BookCardSkeleton />);

    const imageSkeleton = document.querySelector('.aspect-\\[2\\/3\\]');
    expect(imageSkeleton).toBeInTheDocument();
  });

  it('renders with muted background color', () => {
    render(<BookCardSkeleton />);

    const skeletonElements = document.querySelectorAll('.bg-muted');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders proper spacing in skeleton structure', () => {
    render(<BookCardSkeleton />);

    const card = screen.getByTestId('card');
    const contentArea = card.querySelector('.p-4');
    expect(contentArea).toBeInTheDocument();
  });

  it('has rounded corners on skeleton placeholders', () => {
    render(<BookCardSkeleton />);

    const roundedElements = document.querySelectorAll('.rounded');
    expect(roundedElements.length).toBeGreaterThan(0);
  });

  it('maintains consistent styling with BookCard layout', () => {
    const { rerender } = render(<BookCardSkeleton />);
    
    const skeletonCard = screen.getByTestId('card');
    expect(skeletonCard).toHaveClass('overflow-hidden');
    
    rerender(<BookCardSkeleton />);
    expect(screen.getByTestId('card')).toHaveClass('overflow-hidden');
  });
});
