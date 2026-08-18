import { apiRequest } from './apiClient';
import type { User } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  /**
   * Log in user with email & password
   */
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const data = await apiRequest<LoginResponse>('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('unb_auth_token', data.token);
    }
    return data;
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<User> {
    return apiRequest<User>('auth/me');
  },

  /**
   * Log out user — clears client-side token and optionally notifies backend
   */
  async logout(): Promise<void> {
    try {
      await apiRequest('auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('unb_auth_token');
    }
  },

  /**
   * Check if token exists in local storage
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('unb_auth_token');
  },
};
