import { useState, useCallback } from 'react';

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
}

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (url?: string, options?: UseFetchOptions) => Promise<void>;
}

export function useFetch<T = any>(initialUrl?: string, initialOptions?: UseFetchOptions): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // @ts-ignore
    const fetchData = useCallback(async (url?: string, options?: UseFetchOptions) => {
    const fetchUrl = url || initialUrl;
    if (!fetchUrl) {
      setError('No URL provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(fetchUrl, {
        method: options?.method || initialOptions?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...initialOptions?.headers,
          ...options?.headers,
        },
        body: options?.body || initialOptions?.body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [initialUrl, initialOptions]);

  return { data, loading, error, fetchData };
}
