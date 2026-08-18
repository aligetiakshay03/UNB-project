import { apiRequest } from './apiClient';
import type { Job } from '../types';

export const jobService = {
  /**
   * Fetch published & non-expired jobs
   */
  async getJobs(params?: { type?: string; page?: number; limit?: number }): Promise<Job[]> {
    const query = new URLSearchParams();
    if (params?.type && params.type !== 'ALL') query.append('type', params.type);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<Job[]>(`jobs${qs}`);
  },

  /**
   * Fetch single job by slug
   */
  async getJobBySlug(slug: string): Promise<Job> {
    return apiRequest<Job>(`jobs/${slug}`);
  },
};
