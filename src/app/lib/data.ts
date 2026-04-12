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

export interface Reservation {
  id: string;
  bookId: string;
  book: Book;
  requestedDate: string;
  estimatedAvailability: string;
  position: number;
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

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Art of Computer Programming',
    author: 'Donald Knuth',
    category: 'Science',
    isbn: '978-0201896831',
    doi: '10.5555/1234567',
    description: 'A comprehensive monograph written by Donald Knuth that covers many kinds of programming algorithms and their analysis. The book is considered one of the most important works in computer science.',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 1968,
    pages: 672,
    publisher: 'Addison-Wesley',
    edition: '3rd Edition',
    shelfLocation: '005.1 K72a',
    department: 'Computer Science',
    availabilityType: 'both',
    floor: '3rd Floor',
    wing: 'North Wing',
    academicImpact: 342,
    courseReserve: ['CS101', 'CS301'],
  },
  {
    id: '2',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    isbn: '978-0062316097',
    description: 'Explores the history of humankind from the Stone Age to the modern age. Harari examines how Homo sapiens came to dominate the world through cognitive, agricultural, and scientific revolutions.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 2011,
    pages: 464,
    publisher: 'Harper',
    edition: '1st Edition',
    shelfLocation: '909 H255s',
    department: 'History',
    availabilityType: 'physical',
    floor: '2nd Floor',
    wing: 'East Wing',
    academicImpact: 128,
    courseReserve: ['HIST201'],
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    isbn: '978-0451524935',
    description: 'A dystopian social science fiction novel that follows the life of Winston Smith, a low-ranking member of "the Party" in Oceania. The novel explores themes of totalitarianism, surveillance, and censorship.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    status: 'borrowed',
    publishedYear: 1949,
    pages: 328,
    publisher: 'Secker & Warburg',
    edition: 'Reprint',
    shelfLocation: '823.914 O79n',
    department: 'Literature',
    availabilityType: 'both',
    floor: '1st Floor',
    wing: 'Central',
    academicImpact: 256,
    courseReserve: ['LIT301', 'POL210'],
  },
  {
    id: '4',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Science',
    isbn: '978-0132350884',
    description: 'A handbook of agile software craftsmanship that teaches the principles of writing clean, maintainable code. Martin explains the difference between good and bad code and shows how to transform the latter into the former.',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 2008,
    pages: 464,
    publisher: 'Prentice Hall',
    edition: '1st Edition',
    shelfLocation: '005.1 M379c',
    department: 'Engineering',
    availabilityType: 'both',
    floor: '3rd Floor',
    wing: 'North Wing',
    academicImpact: 189,
    courseReserve: ['CS201', 'ENG401'],
  },
  {
    id: '5',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    isbn: '978-0743273565',
    description: 'A classic American novel set in the Jazz Age that follows the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan. A critique of the American Dream.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    status: 'reserved',
    publishedYear: 1925,
    pages: 180,
    publisher: 'Scribner',
    edition: 'Reprint',
    shelfLocation: '813.52 F553g',
    department: 'Literature',
    availabilityType: 'physical',
    floor: '1st Floor',
    wing: 'Central',
    academicImpact: 412,
    courseReserve: ['LIT101'],
  },
  {
    id: '6',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    isbn: '978-0553380163',
    description: 'A landmark volume in science writing that explores cosmology, black holes, and the nature of time and space. Hawking makes complex physics concepts accessible to general readers.',
    coverUrl: 'https://images.unsplash.com/photo-1614544048536-0d28caf77200?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 1988,
    pages: 256,
    publisher: 'Bantam Books',
    edition: '10th Anniversary',
    shelfLocation: '530.1 H392b',
    department: 'Physics',
    availabilityType: 'both',
    floor: '3rd Floor',
    wing: 'South Wing',
    academicImpact: 287,
    courseReserve: ['PHYS301'],
  },
  {
    id: '7',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    isbn: '978-0061120084',
    description: 'Set in the American South during the 1930s, this novel explores themes of racial injustice and moral growth through the eyes of young Scout Finch. A timeless classic of American literature.',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 1960,
    pages: 324,
    publisher: 'J.B. Lippincott',
    edition: 'Reprint',
    shelfLocation: '813.54 L481t',
    department: 'Literature',
    availabilityType: 'physical',
    floor: '1st Floor',
    wing: 'Central',
    academicImpact: 356,
  },
  {
    id: '8',
    title: 'The Silk Roads',
    author: 'Peter Frankopan',
    category: 'History',
    isbn: '978-1101912379',
    description: 'A new history of the world that places the center of the world in the middle of the East. Frankopan challenges the traditional Western-centric view of history.',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 2015,
    pages: 636,
    publisher: 'Bloomsbury',
    edition: '1st Edition',
    shelfLocation: '909.1 F828s',
    department: 'History',
    availabilityType: 'both',
    floor: '2nd Floor',
    wing: 'East Wing',
    academicImpact: 94,
    courseReserve: ['HIST401'],
  },
  {
    id: '9',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Science',
    isbn: '978-0374533557',
    description: 'Nobel laureate Daniel Kahneman explores the two systems that drive the way we think: System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.',
    coverUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
    status: 'borrowed',
    publishedYear: 2011,
    pages: 499,
    publisher: 'Farrar, Straus and Giroux',
    edition: '1st Edition',
    shelfLocation: '153.4 K12t',
    department: 'Psychology',
    availabilityType: 'physical',
    floor: '2nd Floor',
    wing: 'West Wing',
    academicImpact: 431,
    courseReserve: ['PSY201'],
  },
  {
    id: '10',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Fiction',
    isbn: '978-0141439518',
    description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments and the difference between superficial goodness and actual goodness.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 1813,
    pages: 432,
    publisher: 'Penguin Classics',
    edition: 'Reprint',
    shelfLocation: '823.7 A923p',
    department: 'Literature',
    availabilityType: 'digital',
    floor: 'Digital Collection',
    wing: 'Online',
    academicImpact: 523,
    courseReserve: ['LIT201'],
  },
  {
    id: '11',
    title: 'The Second World War',
    author: 'Winston Churchill',
    category: 'History',
    isbn: '978-0395410561',
    description: 'A comprehensive six-volume history of World War II written by Winston Churchill, who led Britain through the war. An insider\'s perspective on one of history\'s most significant conflicts.',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 1948,
    pages: 1056,
    publisher: 'Houghton Mifflin',
    edition: 'Complete Edition',
    shelfLocation: '940.53 C563s',
    department: 'History',
    availabilityType: 'physical',
    floor: '2nd Floor',
    wing: 'East Wing',
    academicImpact: 678,
  },
  {
    id: '12',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fiction',
    isbn: '978-0547928227',
    description: 'A fantasy novel that follows the quest of home-loving hobbit Bilbo Baggins to win a share of the treasure guarded by a dragon. A prelude to The Lord of the Rings.',
    coverUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop',
    status: 'available',
    publishedYear: 1937,
    pages: 310,
    publisher: 'Allen & Unwin',
    edition: '75th Anniversary',
    shelfLocation: '823.912 T649h',
    department: 'Literature',
    availabilityType: 'both',
    floor: '1st Floor',
    wing: 'Central',
    academicImpact: 298,
  },
];

export const mockLoans: Loan[] = [
  {
    id: 'l1',
    bookId: '3',
    book: mockBooks[2],
    borrowedDate: '2026-02-20',
    returnDate: '2026-03-20',
    status: 'active',
    canRenew: true,
    fineAmount: 0,
  },
  {
    id: 'l2',
    bookId: '9',
    book: mockBooks[8],
    borrowedDate: '2026-01-15',
    returnDate: '2026-02-15',
    status: 'overdue',
    canRenew: false,
    fineAmount: 40.00,
  },
  {
    id: 'l3',
    bookId: '1',
    book: mockBooks[0],
    borrowedDate: '2025-12-01',
    returnDate: '2026-01-01',
    returnedDate: '2025-12-28',
    status: 'returned',
    canRenew: false,
    fineAmount: 0,
  },
  {
    id: 'l4',
    bookId: '6',
    book: mockBooks[5],
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
    bookId: '3',
    book: mockBooks[2],
    readingStatus: 'reading',
    progress: 65,
  },
  {
    bookId: '9',
    book: mockBooks[8],
    readingStatus: 'reading',
    progress: 40,
  },
  {
    bookId: '1',
    book: mockBooks[0],
    readingStatus: 'completed',
  },
  {
    bookId: '6',
    book: mockBooks[5],
    readingStatus: 'completed',
  },
  {
    bookId: '5',
    book: mockBooks[4],
    readingStatus: 'wishlist',
  },
  {
    bookId: '4',
    book: mockBooks[3],
    readingStatus: 'wishlist',
  },
];

export const mockReservations: Reservation[] = [
  {
    id: 'r1',
    bookId: '5',
    book: mockBooks[4],
    requestedDate: '2026-03-01',
    estimatedAvailability: '2026-03-15',
    position: 2,
  },
];

export const departments = [
  'Computer Science',
  'Engineering',
  'Literature',
  'History',
  'Physics',
  'Psychology',
  'Mathematics',
  'Law',
  'Arts',
];

export const courseReserves = [
  'CS101',
  'CS201',
  'CS301',
  'ENG401',
  'LIT101',
  'LIT201',
  'LIT301',
  'HIST201',
  'HIST401',
  'PHYS301',
  'PSY201',
  'POL210',
];
