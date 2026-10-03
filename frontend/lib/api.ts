const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await res.json();

  if (!body.success) {
    throw new ApiError(
      body.error?.code || 'UNKNOWN_ERROR',
      body.error?.message || 'An error occurred',
      res.status
    );
  }

  return body.data as T;
}

// Auth API
export const authApi = {
  register: (email: string, password: string) =>
    apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch('/api/auth/logout', { method: 'POST' }),

  me: () =>
    apiFetch<{ user: import('../types').User }>('/api/auth/me'),
};

// Day Status API
export const dayStatusApi = {
  getByYear: (year: number) =>
    apiFetch<{ year: number; statuses: import('../types').DayStatus[] }>(
      `/api/day-status?year=${year}`
    ),

  getByDate: (date: string) =>
    apiFetch<{ status: import('../types').DayStatus } | null>(
      `/api/day-status/${date}`
    ),

  create: (date: string, status: string) =>
    apiFetch<{ status: import('../types').DayStatus }>('/api/day-status', {
      method: 'POST',
      body: JSON.stringify({ date, status }),
    }),

  update: (date: string, status: string) =>
    apiFetch<{ status: import('../types').DayStatus }>(`/api/day-status/${date}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  delete: (date: string) =>
    apiFetch(`/api/day-status/${date}`, { method: 'DELETE' }),
};

export { ApiError };
