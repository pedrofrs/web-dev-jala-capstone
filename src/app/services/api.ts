/**
 * API Service - Handles all HTTP requests with JWT token management
 * Includes request/response interceptors for authentication
 */

interface ApiRequestConfig {
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Get stored JWT token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store tokens in localStorage
 */
export const setTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Clear stored tokens (logout)
 */
export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Add Authorization header with token to requests
 */
const getHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Generic API request handler
 */
const apiRequest = async <T = any>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers: customHeaders } = config;
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: getHeaders(customHeaders),
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      // If token expired, attempt refresh
      if (response.status === 401 && endpoint !== '/auth/login') {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Retry original request with new token
          return apiRequest<T>(endpoint, config);
        }
      }

      return {
        error: data.message || data.error || 'An error occurred',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    return false;
  }

  const data = await response.json();
  setTokens(data.accessToken, data.refreshToken || refreshToken);

  return true;
};

/**
 * API Methods
 */

// Authentication
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (email: string, password: string, name: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  verify: () =>
    apiRequest('/auth/verify', {
      method: 'POST',
    }),
};

// Student data
export const studentAPI = {
  getProfile: () =>
    apiRequest('/student/profile', {
      method: 'GET',
    }),

  updateProfile: (data: any) =>
    apiRequest('/student/profile', {
      method: 'PUT',
      body: data,
    }),

  getDashboard: () =>
    apiRequest('/student/dashboard', {
      method: 'GET',
    }),
};

// Books
export const booksAPI = {
  getAll: () =>
    apiRequest('/books', {
      method: 'GET',
    }),

  getById: (id: string) =>
    apiRequest(`/books/${id}`, {
      method: 'GET',
    }),

  search: (query: string) =>
    apiRequest(`/books/search?q=${query}`, {
      method: 'GET',
    }),
};

// Loans
export const loansAPI = {
  getActive: () =>
    apiRequest('/loans/active', {
      method: 'GET',
    }),

  borrow: (bookId: string) =>
    apiRequest('/loans', {
      method: 'POST',
      body: { bookId },
    }),

  renew: (loanId: string) =>
    apiRequest(`/loans/${loanId}/renew`, {
      method: 'POST',
    }),

  return: (loanId: string) =>
    apiRequest(`/loans/${loanId}/return`, {
      method: 'POST',
    }),
};

// Reservations
export const reservationsAPI = {
  getAll: () =>
    apiRequest('/reservations', {
      method: 'GET',
    }),

  reserve: (bookId: string) =>
    apiRequest('/reservations', {
      method: 'POST',
      body: { bookId },
    }),

  cancel: (reservationId: string) =>
    apiRequest(`/reservations/${reservationId}`, {
      method: 'DELETE',
    }),
};

export default {
  authAPI,
  studentAPI,
  booksAPI,
  loansAPI,
  reservationsAPI,
  getToken,
  setTokens,
  clearTokens,
};
