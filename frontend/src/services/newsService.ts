import { apiRequest } from './apiClient';
import type { News } from '../types';

export const newsService = {
  /**
   * Fetch published news articles, optionally filtered by category
   */
  async getNews(params?: { category?: string; page?: number; limit?: number }): Promise<News[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'ALL') query.append('category', params.category);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<News[]>(`news${qs}`);
  },

  /**
   * Fetch single news article by slug
   */
  async getNewsBySlug(slug: string): Promise<News> {
    return apiRequest<News>(`news/${slug}`);
  },
};
