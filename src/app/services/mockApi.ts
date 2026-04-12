/**
 * Mock API Server - Simulates backend responses
 * Provides endpoints for authentication, student data, books, loans, etc.
 */

interface MockUser {
  id: string;
  email: string;
  name: string;
  registrationNumber: string;
}

interface MockAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: MockUser;
}

// In-memory token storage (in production, this would be on the backend)
const tokenBlacklist = new Set<string>();

// Mock users database
const mockUsers: Record<string, { password: string; user: MockUser }> = {
  'ana.silva@university.edu': {
    password: 'password123',
    user: {
      id: '1',
      email: 'ana.silva@university.edu',
      name: 'Ana Silva',
      registrationNumber: 'REG2024001234',
    },
  },
  'demo@example.com': {
    password: 'demo123',
    user: {
      id: '2',
      email: 'demo@example.com',
      name: 'Demo User',
      registrationNumber: 'REG2024005678',
    },
  },
};

// Mock JWT token generation (simplified - not cryptographically secure)
const generateToken = (payload: any, expiresIn: number = 3600): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now() / 1000, exp: Date.now() / 1000 + expiresIn }));
  const signature = btoa('mock_signature');
  return `${header}.${body}.${signature}`;
};

// Mock API endpoints
export const mockApiEndpoints: Record<string, any> = {
  // Authentication endpoints
  'POST /api/auth/login': async (body: { email: string; password: string }): Promise<MockAuthResponse> => {
    const user = mockUsers[body.email];

    if (!user || user.password !== body.password) {
      throw new Error('Invalid email or password');
    }

    const accessToken = generateToken({ userId: user.user.id, email: user.user.email }, 3600); // 1 hour
    const refreshToken = generateToken({ userId: user.user.id, type: 'refresh' }, 604800); // 7 days

    return {
      accessToken,
      refreshToken,
      user: user.user,
    };
  },

  'POST /api/auth/register': async (body: { email: string; password: string; name: string }) => {
    if (mockUsers[body.email]) {
      throw new Error('Email already registered');
    }

    const newUser: MockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: body.email,
      name: body.name,
      registrationNumber: `REG${Date.now()}`,
    };

    mockUsers[body.email] = {
      password: body.password,
      user: newUser,
    };

    const accessToken = generateToken({ userId: newUser.id, email: newUser.email }, 3600);
    const refreshToken = generateToken({ userId: newUser.id, type: 'refresh' }, 604800);

    return {
      accessToken,
      refreshToken,
      user: newUser,
    };
  },

  'POST /api/auth/logout': async (params: { headers?: Record<string, string> }) => {
    const authHeader = params.headers?.authorization || params.headers?.Authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (token) {
      tokenBlacklist.add(token);
    }

    return { message: 'Logged out successfully' };
  },

  'POST /api/auth/refresh': async (body: { refreshToken: string }) => {
    if (tokenBlacklist.has(body.refreshToken)) {
      throw new Error('Invalid refresh token');
    }

    // Decode token to get user info (simplified)
    try {
      const parts = body.refreshToken.split('.');
      const payload = JSON.parse(atob(parts[1]));
      
      const accessToken = generateToken({ userId: payload.userId, email: payload.email }, 3600);
      return {
        accessToken,
        refreshToken: body.refreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  'POST /api/auth/verify': async (params: { headers?: Record<string, string> }) => {
    const authHeader = params.headers?.authorization || params.headers?.Authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!token) {
      throw new Error('Missing Authorization header');
    }

    if (tokenBlacklist.has(token)) {
      throw new Error('Token is invalid');
    }

    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      
      if (payload.exp < Date.now() / 1000) {
        throw new Error('Token expired');
      }

      return { valid: true, ...payload };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Student profile endpoints
  'GET /api/student/profile': async () => {
    return {
      id: '1',
      email: 'ana.silva@university.edu',
      name: 'Ana Silva',
      registrationNumber: 'REG2024001234',
      enrollmentStatus: 'active',
      department: 'Computer Science',
      totalFines: 12.00,
      activeLoans: 3,
      reservedBooks: 1,
      wishlistBooks: 5,
    };
  },

  'GET /api/student/dashboard': async () => {
    return {
      student: {
        id: '1',
        name: 'Ana Silva',
      },
      stats: {
        activeLoans: 3,
        reservedBooks: 1,
        totalFines: 12.00,
        wishlistBooks: 5,
      },
      recentLoans: [
        {
          id: '1',
          title: 'The Art of Computer Programming',
          borrowedDate: '2024-04-01',
          returnDate: '2024-05-01',
          status: 'active',
        },
      ],
    };
  },

  // Books endpoints
  'GET /api/books': async () => {
    return {
      books: [
        {
          id: '1',
          title: 'The Art of Computer Programming',
          author: 'Donald Knuth',
          status: 'available',
          availabilityType: 'both',
        },
      ],
    };
  },

  'GET /api/books/:id': async (id: string) => {
    return {
      id,
      title: 'Sample Book',
      author: 'Author Name',
      status: 'available',
      description: 'A great book',
    };
  },
};

/**
 * Intercept fetch to use mock API when backend is unavailable
 */
export const setupMockAPI = () => {
  const originalFetch = window.fetch;

  (window.fetch as any) = async (url: string, config?: RequestInit) => {
    const method = config?.method || 'GET';
    
    // Extract path from full URL (remove protocol, host, port)
    let urlPath = url;
    try {
      const urlObj = new URL(url);
      urlPath = urlObj.pathname + urlObj.search;
    } catch {
      // If URL parsing fails, use as is
      urlPath = url;
    }

    const key = `${method} ${urlPath}`;

    // Check if we have a mock endpoint for this request
    for (const [mockKey, handler] of Object.entries(mockApiEndpoints)) {
      // Simple pattern matching (e.g., "POST /api/books/:id")
      const pattern = mockKey.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);

      if (regex.test(key)) {
        try {
          let body = undefined;
          if (config?.body) {
            body = JSON.parse(config.body as string);
          }

          // Extract path parameters and merge with body
          const pathParams = extractPathParams(mockKey, urlPath);
          const params = { ...pathParams, ...body, headers: config?.headers || {} };

          const result = await handler(params);

          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error: any) {
          return new Response(
            JSON.stringify({
              error: error.message,
              message: error.message,
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }
    }

    // Fall back to real API if no mock found
    return originalFetch(url, config);
  };
};

/**
 * Extract path parameters from URL pattern and actual URL
 */
function extractPathParams(pattern: string, url: string): Record<string, string> {
  const patternParts = pattern.split('/');
  const urlParts = url.split('/');
  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].substring(1);
      params[paramName] = urlParts[i];
    }
  }

  return params;
}

export default setupMockAPI;
