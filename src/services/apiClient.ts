const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * Generic fetch wrapper with credentials enabled for session-based auth.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include', // Crucial for sending/receiving HttpOnly session cookies
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  const response = await fetch(url, defaultOptions);

  if (response.status === 401) {
    // Handle unauthorized (session expired or not logged in)
    throw new Error('UNAUTHORIZED');
  }

  if (response.status === 204) {
    return {} as T;
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(errorData.message ?? `API error: ${response.status}`);
  }

  const data = (await response.json()) as T;
  return data;
}
