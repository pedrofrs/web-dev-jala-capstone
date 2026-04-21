const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1';

if (!API_KEY) {
  console.error('ERRO: VITE_GOOGLE_BOOKS_API_KEY não foi encontrada. Verifique seu arquivo .env e reinicie o servidor do Vite.');
}

const searchCache = new Map<string, any>();

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{
      type: 'ISBN_10' | 'ISBN_13' | 'OTHER';
      identifier: string;
    }>;
    readingModes?: {
      text: boolean;
      image: boolean;
    };
    pageCount?: number;
    printType?: string;
    categories?: string[];
    maturityRating?: string;
    allowAnonLogging?: boolean;
    contentVersion?: string;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
  };
  saleInfo?: {
    country?: string;
    saleability?: string;
    isEbook?: boolean;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
    retailPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
  accessInfo?: {
    country?: string;
    viewability?: string;
    embeddable?: boolean;
    publicDomain?: boolean;
    textToSpeechPermission?: string;
    epub?: {
      isAvailable: boolean;
      acsTokenLink?: string;
    };
    pdf?: {
      isAvailable: boolean;
      acsTokenLink?: string;
    };
  };
}

export interface GoogleBooksSearchResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBooksVolume[];
}

export const searchBooks = async (
  query: string,
  startIndex: number = 0,
  category: string = 'all',
  sortBy: string = 'title'
): Promise<GoogleBooksSearchResponse> => {
  if (!query || query.trim() === '') {
    return { kind: 'books#volumes', totalItems: 0, items: [] };
  }

  const cacheKey = `${query}:${startIndex}:${category}:${sortBy}`;
  
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  try {
    let retries = 0;
    const maxRetries = 3;
    let lastError: any;

    while (retries < maxRetries) {
      try {
        const url = new URL(`${BASE_URL}/volumes`);
        
        let finalQuery = query;
        if (category !== 'all') {
          finalQuery += `+subject:${category}`;
        }

        url.searchParams.append('q', finalQuery);
        url.searchParams.append('key', API_KEY);
        url.searchParams.append('startIndex', startIndex.toString());
        url.searchParams.append('maxResults', '40');
        url.searchParams.append('printType', 'books');
        
        if (sortBy === 'year') {
           url.searchParams.append('orderBy', 'newest');
        } else {
           url.searchParams.append('orderBy', 'relevance');
        }

        const response = await fetch(url.toString());

        if (response.status === 503) {
          retries++;
          if (retries < maxRetries) {
            const delay = Math.pow(2, retries) * 1000;
            console.log(`Google Books API unavailable, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Google Books API error: ${response.status}`, errorData);
          return { kind: 'books#volumes', totalItems: 0, items: [] };
        }

        const data: GoogleBooksSearchResponse = await response.json();
        
        searchCache.set(cacheKey, data);
        
        return data;
      } catch (error) {
        lastError = error;
        retries++;
        if (retries < maxRetries) {
          const delay = Math.pow(2, retries) * 1000;
          console.log(`Error searching Google Books, retrying in ${delay}ms...`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error('Error searching Google Books after retries:', lastError);
    return { kind: 'books#volumes', totalItems: 0, items: [] };
  } catch (error) {
    console.error('Error searching Google Books:', error);
    return { kind: 'books#volumes', totalItems: 0, items: [] };
  }
};

export const getBookDetails = async (volumeId: string): Promise<GoogleBooksVolume | null> => {
  const cacheKey = `book:${volumeId}`;
  
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey) as GoogleBooksVolume;
  }

  try {
    let retries = 0;
    const maxRetries = 3;
    let lastError: any;

    while (retries < maxRetries) {
      try {
        const url = new URL(`${BASE_URL}/volumes/${volumeId}`);
        url.searchParams.append('key', API_KEY);

        const response = await fetch(url.toString());

        if (response.status === 503) {
          retries++;
          if (retries < maxRetries) {
            const delay = Math.pow(2, retries) * 1000;
            console.log(`Google Books API unavailable, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Google Books API error: ${response.status}`, errorData);
          return null;
        }

        const data: GoogleBooksVolume = await response.json();
        
        searchCache.set(cacheKey, data);
        
        return data;
      } catch (error) {
        lastError = error;
        retries++;
        if (retries < maxRetries) {
          const delay = Math.pow(2, retries) * 1000;
          console.log(`Error getting book details, retrying in ${delay}ms...`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error('Error getting book details after retries:', lastError);
    return null;
  } catch (error) {
    console.error('Error getting book details:', error);
    return null;
  }
};

export const clearCache = (): void => {
  searchCache.clear();
};