import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard, BookCardSkeleton } from './BookCard';
import { Book } from '../lib/data';
import * as localStorageService from '../services/localStorageService';

// Mock do react-router
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock dos serviços de LocalStorage
jest.mock('../services/localStorageService', () => ({
  isInLibrary: jest.fn(),
  isInWishlist: jest.fn(),
  toggleLibrary: jest.fn(),
  toggleWishlist: jest.fn(),
}));

// Mock dos sub-componentes visuais para isolar o teste
jest.mock('./StatusBadge', () => ({
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

  // TESTE 1: Comportamento de Renderização Principal
  it('renderiza as informações principais do livro corretamente', () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText('O Senhor dos Anéis')).toBeInTheDocument();
    expect(screen.getByText('J.R.R. Tolkien')).toBeInTheDocument();
    expect(screen.getByText('A1-01')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'O Senhor dos Anéis' })).toHaveAttribute('src', mockBook.coverUrl);
    expect(screen.getByTestId('status-badge')).toHaveTextContent('available');
  });

  // TESTE 2: Regras de Negócio Condicionais (Disponibilidade)
  it('exibe as badges corretas baseado no tipo de disponibilidade (Digital/Both)', () => {
    const { rerender } = render(<BookCard book={{ ...mockBook, availabilityType: 'digital' }} />);
    expect(screen.getByText('Digital')).toBeInTheDocument();
    expect(screen.queryByText('Both')).not.toBeInTheDocument();

    rerender(<BookCard book={{ ...mockBook, availabilityType: 'both' }} />);
    expect(screen.getByText('Both')).toBeInTheDocument();
    expect(screen.queryByText('Digital')).not.toBeInTheDocument();
  });

  // TESTE 3: Comportamento de Navegação
  it('navega para a página de detalhes do livro ao clicar no card', () => {
    render(<BookCard book={mockBook} />);

    // Pega o card pelo primeiro elemento div pai (role não é trivial pois é um card customizado)
    const cardElement = screen.getByText('O Senhor dos Anéis').closest('.cursor-pointer');
    fireEvent.click(cardElement!);

    expect(mockNavigate).toHaveBeenCalledWith('/book/1');
  });

  // TESTE 4: Ação Isolada - Biblioteca
  it('alterna o status do livro na biblioteca sem disparar a navegação do card', () => {
    (localStorageService.toggleLibrary as jest.Mock).mockReturnValue(true);
    render(<BookCard book={mockBook} />);

    const libraryButton = screen.getByRole('button', { name: /biblioteca/i });
    fireEvent.click(libraryButton);

    expect(localStorageService.toggleLibrary).toHaveBeenCalledWith(mockBook);
    expect(mockNavigate).not.toHaveBeenCalled(); // Garante que o stopPropagation funcionou
    expect(screen.getByRole('button', { name: /Na Biblioteca/i })).toBeInTheDocument();
  });

  // TESTE 5: Ação Isolada - Wishlist
  it('alterna o status do livro na wishlist sem disparar a navegação do card', () => {
    (localStorageService.toggleWishlist as jest.Mock).mockReturnValue(true);
    render(<BookCard book={mockBook} />);

    const wishlistButton = screen.getByRole('button', { name: /wishlist/i });
    fireEvent.click(wishlistButton);

    expect(localStorageService.toggleWishlist).toHaveBeenCalledWith(mockBook);
    expect(mockNavigate).not.toHaveBeenCalled(); // Garante que o stopPropagation funcionou
    expect(screen.getByRole('button', { name: /Na Wishlist/i })).toBeInTheDocument();
  });
});

