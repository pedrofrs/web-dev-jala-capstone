import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CitationDialog } from './CitationDialog';
import { Book } from '../lib/data';
import { toast } from 'sonner';

jest.mock('sonner');

jest.mock('./ui/dialog', () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogTrigger: ({ children, asChild }: any) => <div data-testid="dialog-trigger">{children}</div>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
}));

jest.mock('./ui/button', () => ({
  Button: ({ children, onClick, className }: any) => (
      <button data-testid="button" onClick={onClick} className={className}>
        {children}
      </button>
  ),
}));

jest.mock('./ui/tabs', () => ({
  Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button data-testid={`tab-${value}`}>{children}</button>,
  TabsContent: ({ children, value }: any) => <div data-testid={`tab-content-${value}`}>{children}</div>,
}));

jest.mock('lucide-react', () => ({
  Copy: () => <span data-testid="copy-icon" />,
  Check: () => <span data-testid="check-icon" />,
  FileText: () => <span data-testid="file-text-icon" />,
}));

describe('CitationDialog', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Advanced TypeScript',
    author: 'John Smith',
    category: 'Technology',
    isbn: '1234567890',
    description: 'A comprehensive guide to TypeScript',
    coverUrl: 'https://example.com/cover.jpg',
    status: 'available',
    publishedYear: 2023,
    pages: 450,
    publisher: 'Tech Press',
    edition: '2nd',
    shelfLocation: 'A1-01',
    department: 'Technology',
    availabilityType: 'both',
    floor: '2',
    wing: 'B',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn(() => Promise.resolve()) },
    });
  });

  it('renderiza o botão de gatilho, cabeçalho e as abas de formato', () => {
    render(<CitationDialog book={mockBook} />);

    expect(screen.getByText('Cite This Book')).toBeInTheDocument();
    expect(screen.getByText('Citation Generator')).toBeInTheDocument();
    expect(screen.getByTestId('tab-apa')).toBeInTheDocument();
    expect(screen.getByTestId('tab-abnt')).toBeInTheDocument();
    expect(screen.getByTestId('tab-mla')).toBeInTheDocument();
  });

  it('gera corretamente as citações nos formatos APA, ABNT e MLA', () => {
    render(<CitationDialog book={mockBook} />);

    expect(screen.getByTestId('tab-content-apa')).toHaveTextContent('Smith, J. (2023). Advanced TypeScript. Tech Press.');
    expect(screen.getByTestId('tab-content-abnt')).toHaveTextContent('SMITH, John. Advanced TypeScript. 2nd. Tech Press, 2023. 450 p.');
    expect(screen.getByTestId('tab-content-mla')).toHaveTextContent('John Smith. Advanced TypeScript. 2nd. Tech Press, 2023.');
  });

  it('lida corretamente com a extração de nomes e sobrenomes compostos na citação', () => {
    const bookWithComplexName = { ...mockBook, author: 'Mary Jane Watson' };
    render(<CitationDialog book={bookWithComplexName} />);

    expect(screen.getByTestId('tab-content-apa')).toHaveTextContent('Watson, M. (2023)');
    expect(screen.getByTestId('tab-content-abnt')).toHaveTextContent('WATSON, Mary Jane.');
  });

  it('copia a citação para a área de transferência e exibe notificação de sucesso', async () => {
    render(<CitationDialog book={mockBook} />);

    const copyApaButton = screen.getAllByTestId('button').find(btn => btn.textContent?.includes('Copy APA'));
    fireEvent.click(copyApaButton!);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Smith, J. (2023). Advanced TypeScript. Tech Press.');
      expect(toast.success).toHaveBeenCalledWith('Citation copied in APA format');
    });
  });

  it('altera o estado do botão para "Copied!" com o ícone de check após a cópia', async () => {
    render(<CitationDialog book={mockBook} />);

    const copyApaButton = screen.getAllByTestId('button').find(btn => btn.textContent?.includes('Copy APA'));
    fireEvent.click(copyApaButton!);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });
});