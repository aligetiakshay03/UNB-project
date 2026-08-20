/**
 * Central API Client for UNB Web Application
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  message: string;
  details?: Record<string, string[]> | string[];
}

export class ApiException extends Error {
  status: number;
  details?: Record<string, string[]> | string[];

  constructor(status: number, message: string, details?: Record<string, string[]> | string[]) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('unb_auth_token');
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type: application/json if body is not FormData
  if (!(options.body instanceof FormData) && !(headers as Record<string, string>)['Content-Type']) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const result = isJson ? await response.json() : null;

    if (!response.ok) {
      if (response.status === 401 && token) {
        // Clear invalid or expired token from client storage
        localStorage.removeItem('unb_auth_token');
      }
      const errorMsg = result?.error?.message || response.statusText || 'An unexpected error occurred';
      const details = result?.error?.details;
      throw new ApiException(response.status, errorMsg, details);
    }

    return (result?.data !== undefined ? result.data : result) as T;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException(0, (error as Error).message || 'Network connection failed. Please try again.');
  }
}
