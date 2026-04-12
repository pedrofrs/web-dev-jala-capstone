import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CitationDialog } from './CitationDialog';
import { Book } from '../lib/data';
import { toast } from 'sonner';

jest.mock('sonner');

// Mock dialog components
jest.mock('./ui/dialog', () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogTrigger: ({ children, asChild }: any) => <div data-testid="dialog-trigger">{children}</div>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
}));

// Mock button component
jest.mock('./ui/button', () => ({
  Button: ({ children, onClick, variant, className }: any) => (
    <button data-testid="button" onClick={onClick} className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

// Mock tabs components
jest.mock('./ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: any) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }: any) => (
    <button data-testid={`tab-${value}`}>{children}</button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}));

// Mock lucide-react icons
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
    
    // Mock navigator.clipboard globally
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });
  });

  it('renders trigger button with correct label', () => {
    render(<CitationDialog book={mockBook} />);

    expect(screen.getByText('Cite This Book')).toBeInTheDocument();
    expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();
  });

  it('renders dialog header with correct titles', () => {
    render(<CitationDialog book={mockBook} />);

    expect(screen.getByText('Citation Generator')).toBeInTheDocument();
    expect(screen.getByText('Copy the citation in your preferred format')).toBeInTheDocument();
  });

  it('renders all three citation format tabs', () => {
    render(<CitationDialog book={mockBook} />);

    expect(screen.getByTestId('tab-apa')).toBeInTheDocument();
    expect(screen.getByTestId('tab-abnt')).toBeInTheDocument();
    expect(screen.getByTestId('tab-mla')).toBeInTheDocument();
  });

  it('generates correct APA citation format', () => {
    render(<CitationDialog book={mockBook} />);

    const apaContent = screen.getByTestId('tab-content-apa');
    expect(apaContent).toHaveTextContent('Smith, J. (2023). Advanced TypeScript. Tech Press.');
  });

  it('generates correct ABNT citation format', () => {
    render(<CitationDialog book={mockBook} />);

    const abntContent = screen.getByTestId('tab-content-abnt');
    expect(abntContent).toHaveTextContent('SMITH, John. Advanced TypeScript. 2nd. Tech Press, 2023. 450 p.');
  });

  it('generates correct MLA citation format', () => {
    render(<CitationDialog book={mockBook} />);

    const mlaContent = screen.getByTestId('tab-content-mla');
    expect(mlaContent).toHaveTextContent('John Smith. Advanced TypeScript. 2nd. Tech Press, 2023.');
  });

  it('copies APA citation and shows success toast', async () => {
    render(<CitationDialog book={mockBook} />);

    const buttons = screen.getAllByTestId('button');
    const copyApaButton = buttons.find((btn) => btn.textContent?.includes('Copy APA'));

    fireEvent.click(copyApaButton!);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Citation copied in APA format');
    });
  });

  it('copies ABNT citation and shows success toast', async () => {
    render(<CitationDialog book={mockBook} />);

    const buttons = screen.getAllByTestId('button');
    const copyAbntButton = buttons.find((btn) => btn.textContent?.includes('Copy ABNT'));

    fireEvent.click(copyAbntButton!);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Citation copied in ABNT format');
    });
  });

  it('copies MLA citation and shows success toast', async () => {
    render(<CitationDialog book={mockBook} />);

    const buttons = screen.getAllByTestId('button');
    const copyMlaButton = buttons.find((btn) => btn.textContent?.includes('Copy MLA'));

    fireEvent.click(copyMlaButton!);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Citation copied in MLA format');
    });
  });

  it('shows "Copied!" button state after clicking copy', async () => {
    render(<CitationDialog book={mockBook} />);

    const buttons = screen.getAllByTestId('button');
    const copyApaButton = buttons.find((btn) => btn.textContent?.includes('Copy APA'));

    fireEvent.click(copyApaButton!);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  it('handles author name parsing correctly', () => {
    const bookWithDifferentAuthor = {
      ...mockBook,
      author: 'Mary Jane Watson',
    };

    render(<CitationDialog book={bookWithDifferentAuthor} />);

    const apaContent = screen.getByTestId('tab-content-apa');
    expect(apaContent).toHaveTextContent('Watson, M. (2023)');
  });
});

