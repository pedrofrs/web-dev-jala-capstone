import { Book } from '../lib/data';

const LOANS_KEY = 'active-loans';
const HISTORY_KEY = 'loan-history';

export const BORROW_FEE = 5.0;
export const OVERDUE_RATE_PER_DAY = 1.0;

export interface ActiveLoan {
  id: string;
  book: Book;
  borrowedDate: string; // ISO string
  returnDate: string;   // ISO string — 1 month after borrow, extendable
}

export interface LoanHistoryEntry {
  id: string;
  book: Book;
  borrowedDate: string;
  returnDate: string;
  returnedDate: string;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function readLoans(): ActiveLoan[] {
  try {
    const raw = localStorage.getItem(LOANS_KEY);
    return raw ? (JSON.parse(raw) as ActiveLoan[]) : [];
  } catch {
    return [];
  }
}

function writeLoans(loans: ActiveLoan[]): void {
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
}

function readHistory(): LoanHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as LoanHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeHistory(history: LoanHistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addOneMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getLoans(): ActiveLoan[] {
  return readLoans();
}

export function getLoanHistory(): LoanHistoryEntry[] {
  return readHistory();
}

export function isAlreadyBorrowed(bookId: string): boolean {
  return readLoans().some((l) => l.book.id === bookId);
}

export function borrowBook(book: Book): ActiveLoan {
  const now = new Date();
  const loan: ActiveLoan = {
    id: `loan-${Date.now()}`,
    book,
    borrowedDate: now.toISOString(),
    returnDate: addOneMonth(now).toISOString(),
  };
  writeLoans([...readLoans(), loan]);
  return loan;
}

export function returnBook(loanId: string): void {
  const loans = readLoans();
  const loan = loans.find((l) => l.id === loanId);
  if (!loan) return;

  const entry: LoanHistoryEntry = {
    id: loan.id,
    book: loan.book,
    borrowedDate: loan.borrowedDate,
    returnDate: loan.returnDate,
    returnedDate: new Date().toISOString(),
  };
  writeHistory([...readHistory(), entry]);
  writeLoans(loans.filter((l) => l.id !== loanId));
}

export function renewLoan(loanId: string): void {
  writeLoans(
    readLoans().map((l) =>
      l.id === loanId
        ? { ...l, returnDate: addOneMonth(new Date(l.returnDate)).toISOString() }
        : l
    )
  );
}

/**
 * Calculates the total charged amount for a single loan.
 * = fixed borrow fee + R$1/day for each day past the due date.
 */
export function calculateLoanFine(loan: ActiveLoan): number {
  const today = new Date();
  const due = new Date(loan.returnDate);
  const overdueDays = Math.max(
    0,
    Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  );
  return BORROW_FEE + overdueDays * OVERDUE_RATE_PER_DAY;
}

/** Total amount due across all active loans. */
export function calculateTotalFines(): number {
  return readLoans().reduce((sum, loan) => sum + calculateLoanFine(loan), 0);
}

/** Days remaining until due date (negative = overdue). */
export function getDaysRemaining(loan: ActiveLoan): number {
  const today = new Date();
  const due = new Date(loan.returnDate);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(loan: ActiveLoan): boolean {
  return getDaysRemaining(loan) < 0;
}
