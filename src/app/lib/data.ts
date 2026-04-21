export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  doi?: string;
  description: string;
  coverUrl: string;
  status: 'available' | 'borrowed' | 'reserved';
  publishedYear: number;
  pages: number;
  publisher: string;
  edition: string;
  shelfLocation: string;
  department: string;
  availabilityType: 'physical' | 'digital' | 'both';
  floor: string;
  wing: string;
  academicImpact?: number;
  courseReserve?: string[];
}

export interface Loan {
  id: string;
  bookId: string;
  book: Book;
  borrowedDate: string;
  returnDate: string;
  returnedDate?: string;
  status: 'active' | 'overdue' | 'returned';
  canRenew: boolean;
  fineAmount?: number;
}

export interface UserBook {
  bookId: string;
  book: Book;
  readingStatus: 'reading' | 'completed' | 'wishlist';
  progress?: number;
}

export interface Student {
  name: string;
  id: string;
  email: string;
  registrationNumber: string;
  enrollmentStatus: 'active' | 'inactive' | 'suspended';
  totalFines: number;
  activeLoans: number;
  reservedBooks: number;
  wishlistBooks: number;
  department?: string;
}

export const mockStudent: Student = {
  name: 'Ana Silva',
  id: '2024001234',
  email: 'ana.silva@university.edu',
  registrationNumber: 'REG2024001234',
  enrollmentStatus: 'active',
  department: 'Computer Science',
  totalFines: 12.00,
  activeLoans: 3,
  reservedBooks: 1,
  wishlistBooks: 5,
};

// Sample book data for testing loans and user books
// Note: In production, these would be fetched from Google Books API
const sampleBook: Book = {
  id: 'sample-1',
  title: 'Sample Book',
  author: 'Sample Author',
  category: 'Fiction',
  isbn: '978-0000000000',
  description: 'Sample description',
  coverUrl: 'https://via.placeholder.com/128x192',
  status: 'available',
  publishedYear: 2020,
  pages: 300,
  publisher: 'Sample Publisher',
  edition: '1st Edition',
  shelfLocation: 'SAMPLE',
  department: 'General',
  availabilityType: 'digital',
  floor: 'Digital Collection',
  wing: 'Online',
};

export const mockLoans: Loan[] = [
  {
    id: 'l1',
    bookId: 'sample-1',
    book: sampleBook,
    borrowedDate: '2026-02-20',
    returnDate: '2026-03-20',
    status: 'active',
    canRenew: true,
    fineAmount: 0,
  },
  {
    id: 'l2',
    bookId: 'sample-2',
    book: sampleBook,
    borrowedDate: '2026-01-15',
    returnDate: '2026-02-15',
    status: 'overdue',
    canRenew: false,
    fineAmount: 40.00,
  },
  {
    id: 'l3',
    bookId: 'sample-3',
    book: sampleBook,
    borrowedDate: '2025-12-01',
    returnDate: '2026-01-01',
    returnedDate: '2025-12-28',
    status: 'returned',
    canRenew: false,
    fineAmount: 0,
  },
  {
    id: 'l4',
    bookId: 'sample-4',
    book: sampleBook,
    borrowedDate: '2025-11-10',
    returnDate: '2025-12-10',
    returnedDate: '2025-12-08',
    status: 'returned',
    canRenew: false,
    fineAmount: 0,
  },
];

export const mockUserBooks: UserBook[] = [
  {
    bookId: 'sample-1',
    book: sampleBook,
    readingStatus: 'reading',
    progress: 65,
  },
  {
    bookId: 'sample-2',
    book: sampleBook,
    readingStatus: 'reading',
    progress: 40,
  },
  {
    bookId: 'sample-3',
    book: sampleBook,
    readingStatus: 'completed',
  },
  {
    bookId: 'sample-4',
    book: sampleBook,
    readingStatus: 'completed',
  },
  {
    bookId: 'sample-5',
    book: sampleBook,
    readingStatus: 'wishlist',
  },
  {
    bookId: 'sample-6',
    book: sampleBook,
    readingStatus: 'wishlist',
  },
];

export const departments = [
  'General',
  'Computer Science',
  'Engineering',
  'Literature',
  'History',
  'Physics',
  'Psychology',
  'Mathematics',
  'Law',
  'Arts',
  'Philosophy',
  'Science',
];
