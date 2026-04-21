import { Book } from '../lib/data';

const KEYS = {
  MY_LIBRARY: 'my-library',
  WISHLIST: 'wishlist',
} as const;

function readList(key: string): Book[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Book[]) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, books: Book[]): void {
  localStorage.setItem(key, JSON.stringify(books));
}

// ── My Library ───────────────────────────────────────────────────────────────

export function getLibrary(): Book[] {
  return readList(KEYS.MY_LIBRARY);
}

export function isInLibrary(bookId: string): boolean {
  return getLibrary().some((b) => b.id === bookId);
}

export function addToLibrary(book: Book): void {
  if (isInLibrary(book.id)) return;
  writeList(KEYS.MY_LIBRARY, [...getLibrary(), book]);
}

export function removeFromLibrary(bookId: string): void {
  writeList(KEYS.MY_LIBRARY, getLibrary().filter((b) => b.id !== bookId));
}

export function toggleLibrary(book: Book): boolean {
  if (isInLibrary(book.id)) {
    removeFromLibrary(book.id);
    return false;
  }
  addToLibrary(book);
  return true;
}

// ── Wishlist ──────────────────────────────────────────────────────────────────

export function getWishlist(): Book[] {
  return readList(KEYS.WISHLIST);
}

export function isInWishlist(bookId: string): boolean {
  return getWishlist().some((b) => b.id === bookId);
}

export function addToWishlist(book: Book): void {
  if (isInWishlist(book.id)) return;
  writeList(KEYS.WISHLIST, [...getWishlist(), book]);
}

export function removeFromWishlist(bookId: string): void {
  writeList(KEYS.WISHLIST, getWishlist().filter((b) => b.id !== bookId));
}

export function toggleWishlist(book: Book): boolean {
  if (isInWishlist(book.id)) {
    removeFromWishlist(book.id);
    return false;
  }
  addToWishlist(book);
  return true;
}
