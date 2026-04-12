import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';

type TestFetchProps = {
  url?: string;
  options?: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; headers?: Record<string, string>; body?: string };
};

function TestFetchComponent({ url, options }: TestFetchProps) {
  const { data, loading, error, fetchData } = useFetch<any>(url, options);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="error">{error ?? 'null'}</div>
      <div data-testid="data">{data ? JSON.stringify(data) : 'null'}</div>
    </div>
  );
}

describe('useFetch hook', () => {
  afterEach(() => {
    jest.resetAllMocks();
    delete (globalThis as any).fetch;
  });

  it('returns error when no URL is provided', async () => {
    render(<TestFetchComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('No URL provided');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('loads data from the initial URL and updates state', async () => {
    const mockResponse = { message: 'success' };
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    }) as jest.Mock;

    render(<TestFetchComponent url="https://api.example.com/data" />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('data')).toHaveTextContent(JSON.stringify(mockResponse));
    expect(screen.getByTestId('error')).toHaveTextContent('null');
    expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: undefined,
    });
  });

  it('handles HTTP error responses gracefully', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'server error' }),
    }) as jest.Mock;

    render(<TestFetchComponent url="https://api.example.com/fail" />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('error')).toHaveTextContent('HTTP error! status: 500');
    expect(screen.getByTestId('data')).toHaveTextContent('null');
  });
});
