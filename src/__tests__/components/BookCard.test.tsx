import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard, BookCardSkeleton } from '../../app/components/BookCard';
import { Book } from '../../app/lib/data';
import * as localStorageService from '../../app/services/localStorageService';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../../app/services/localStorageService', () => ({
  isInLibrary: jest.fn(),
  isInWishlist: jest.fn(),
  toggleLibrary: jest.fn(),
  toggleWishlist: jest.fn(),
}));

jest.mock('../../app/components/StatusBadge', () => ({
  StatusBadge: ({ status }: { status: string }) => <div data-testid="status-badge">{status}</div>,
}));

describe('BookCard', () => {
  const mockBook: Book = {
    id: '1',
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    category: 'Fantasia',
    isbn: '123456',
    description: 'Um anel para a todos governar.',
    coverUrl: 'https://example.com/cover.jpg',
    status: 'available',
    publishedYear: 1954,
    pages: 1200,
    publisher: 'HarperCollins',
    edition: '1st',
    shelfLocation: 'A1-01',
    department: 'Literatura',
    availabilityType: 'physical',
    floor: '1',
    wing: 'A',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (localStorageService.isInLibrary as jest.Mock).mockReturnValue(false);
    (localStorageService.isInWishlist as jest.Mock).mockReturnValue(false);
  });

  it('renderiza as informações principais do livro corretamente', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText('O Senhor dos Anéis')).toBeInTheDocument();
    expect(screen.getByText('J.R.R. Tolkien')).toBeInTheDocument();
    expect(screen.getByText('A1-01')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'O Senhor dos Anéis' })).toHaveAttribute('src', mockBook.coverUrl);
    expect(screen.getByTestId('status-badge')).toHaveTextContent('available');
  });

  it('exibe as badges corretas baseado no tipo de disponibilidade (Digital/Both)', () => {
    const { rerender } = render(<BookCard book={{ ...mockBook, availabilityType: 'digital' }} />);
    expect(screen.getByText('Digital')).toBeInTheDocument();
    expect(screen.queryByText('Both')).not.toBeInTheDocument();

    rerender(<BookCard book={{ ...mockBook, availabilityType: 'both' }} />);
    expect(screen.getByText('Both')).toBeInTheDocument();
    expect(screen.queryByText('Digital')).not.toBeInTheDocument();
  });

  it('navega para a página de detalhes do livro ao clicar no card', () => {
    render(<BookCard book={mockBook} />);

    const cardElement = screen.getByText('O Senhor dos Anéis').closest('.cursor-pointer');
    fireEvent.click(cardElement!);

    expect(mockNavigate).toHaveBeenCalledWith('/book/1');
  });

  it('alterna o status do livro na biblioteca sem disparar a navegação do card', () => {
    (localStorageService.toggleLibrary as jest.Mock).mockReturnValue(true);
    render(<BookCard book={mockBook} />);

    const libraryButton = screen.getByRole('button', { name: /biblioteca/i });
    fireEvent.click(libraryButton);

    expect(localStorageService.toggleLibrary).toHaveBeenCalledWith(mockBook);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Na Biblioteca/i })).toBeInTheDocument();
  });

  it('alterna o status do livro na wishlist sem disparar a navegação do card', () => {
    (localStorageService.toggleWishlist as jest.Mock).mockReturnValue(true);
    render(<BookCard book={mockBook} />);

    const wishlistButton = screen.getByRole('button', { name: /wishlist/i });
    fireEvent.click(wishlistButton);

    expect(localStorageService.toggleWishlist).toHaveBeenCalledWith(mockBook);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Na Wishlist/i })).toBeInTheDocument();
  });
});
