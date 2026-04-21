/**
 * Book Adapter
 * Converts Google Books API responses to internal Book interface
 */

import { Book } from '../lib/data';
import { GoogleBooksVolume } from './googleBooksApi';

/**
 * Converts a Google Books Volume to our internal Book interface
 */
export const adaptGoogleBooksVolumeToBook = (volume: GoogleBooksVolume): Book => {
  const volumeInfo = volume.volumeInfo;
  const imageLinks = volumeInfo.imageLinks;
  
  // Extract ISBN
  const isbn = volumeInfo.industryIdentifiers?.find(
    (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
  )?.identifier || '';

  return {
    id: volume.id,
    title: volumeInfo.title || 'Untitled',
    author: volumeInfo.authors?.join(', ') || 'Unknown Author',
    category: volumeInfo.categories?.[0] || 'General',
    isbn: isbn,
    description: volumeInfo.description || 'No description available',
    coverUrl: imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover',
    status: 'available' as const,
    publishedYear: parseInt(volumeInfo.publishedDate?.substring(0, 4) || new Date().getFullYear().toString()),
    pages: volumeInfo.pageCount || 0,
    publisher: volumeInfo.publisher || 'Unknown Publisher',
    edition: '1st Edition',
    shelfLocation: `${volume.id.substring(0, 3).toUpperCase()} ${volumeInfo.title?.substring(0, 2).toUpperCase() || 'XX'}`,
    department: volumeInfo.categories?.[0] || 'General',
    availabilityType: 'digital' as const,
    floor: 'Digital Collection',
    wing: 'Online',
  };
};

/**
 * Convert multiple Google Books Volumes to our Book interface
 */
export const adaptGoogleBooksVolumesToBooks = (volumes: GoogleBooksVolume[]): Book[] => {
  return volumes.map(adaptGoogleBooksVolumeToBook);
};
