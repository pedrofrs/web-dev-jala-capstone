import {
  borrowBook,
  calculateLoanFine,
  getDaysRemaining,
  isOverdue,
  BORROW_FEE,
  OVERDUE_RATE_PER_DAY,
  ActiveLoan,
} from '../../app/services/loanService';
import { Book } from '../../app/lib/data';

const mockBook: Book = {
  id: 'book-test-1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  category: 'Technology',
  isbn: '978-0132350884',
  description: 'A handbook of agile software craftsmanship.',
  coverUrl: 'https://example.com/cover.jpg',
  status: 'available',
  publishedYear: 2008,
  pages: 431,
  publisher: 'Prentice Hall',
  edition: '1st',
  shelfLocation: 'A1-001',
  department: 'Computer Science',
  availabilityType: 'physical',
  floor: '2nd Floor',
  wing: 'East Wing',
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('loanService', () => {
  describe('Happy Path 1 — borrowBook sets returnDate exactly 1 month ahead', () => {
    it('creates a loan whose returnDate is exactly 1 month after borrowedDate', () => {
      const fixedNow = new Date('2026-01-15T12:00:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(fixedNow);

      const loan = borrowBook(mockBook);

      const borrowed = new Date(loan.borrowedDate);
      const returnDate = new Date(loan.returnDate);

      expect(returnDate.getFullYear()).toBe(borrowed.getFullYear());
      expect(returnDate.getMonth()).toBe(borrowed.getMonth() + 1);
      expect(returnDate.getDate()).toBe(borrowed.getDate());
    });
  });

  describe('Happy Path 2 — calculateLoanFine charges only fixed fee when not overdue', () => {
    it('returns exactly BORROW_FEE when the due date is in the future', () => {
      const tenDaysFromNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const loan: ActiveLoan = {
        id: 'loan-happy-2',
        book: mockBook,
        borrowedDate: new Date().toISOString(),
        returnDate: tenDaysFromNow.toISOString(),
      };

      expect(calculateLoanFine(loan)).toBe(BORROW_FEE);
    });
  });

  describe('Sad Path 1 — calculateLoanFine adds R$1/day for each overdue day', () => {
    it('charges BORROW_FEE plus overdue surcharge when the due date has passed', () => {
      const overdueDays = 5;
      const pastDate = new Date(Date.now() - overdueDays * 24 * 60 * 60 * 1000);
      const loan: ActiveLoan = {
        id: 'loan-sad-1',
        book: mockBook,
        borrowedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        returnDate: pastDate.toISOString(),
      };

      const fine = calculateLoanFine(loan);
      expect(fine).toBe(BORROW_FEE + overdueDays * OVERDUE_RATE_PER_DAY);
    });
  });

  describe('Sad Path 2 — getDaysRemaining and isOverdue reflect past due date', () => {
    it('returns negative days remaining and flags loan as overdue when due date has passed', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const loan: ActiveLoan = {
        id: 'loan-sad-2',
        book: mockBook,
        borrowedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        returnDate: tenDaysAgo.toISOString(),
      };

      expect(getDaysRemaining(loan)).toBeLessThan(0);
      expect(isOverdue(loan)).toBe(true);
    });
  });
});
