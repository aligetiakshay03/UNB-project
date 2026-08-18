import { apiRequest } from './apiClient';
import type {
  Product,
  Category,
  News,
  Job,
  Application,
  Enquiry,
  ContentStatus,
  ApplicationStatus,
} from '../types';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalNews: number;
  publishedNews: number;
  totalJobs: number;
  publishedJobs: number;
  totalApplications: number;
  newApplications: number;
  totalEnquiries: number;
}

export const adminService = {
  // ─── Categories ─────────────────────────────────────────────────────────────
  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>('admin/categories');
  },

  // ─── Products ───────────────────────────────────────────────────────────────
  async getProducts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }): Promise<{ data: Product[]; meta: { total: number; page: number; limit: number } }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.category && params.category !== 'ALL') query.append('category', params.category);

    const queryString = query.toString();
    const endpoint = `admin/products${queryString ? `?${queryString}` : ''}`;
    
    // apiRequest extracts result.data when present, but for paginated endpoints
    // let's ensure we return { data, meta }
    return apiRequest<{ data: Product[]; meta: { total: number; page: number; limit: number } }>(endpoint);
  },

  async createProduct(formData: FormData): Promise<Product> {
    return apiRequest<Product>('admin/products', {
      method: 'POST',
      body: formData,
    });
  },

  async updateProduct(id: string, formData: FormData): Promise<Product> {
    return apiRequest<Product>(`admin/products/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  async patchProductStatus(id: string, status: ContentStatus): Promise<Product> {
    return apiRequest<Product>(`admin/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // ─── News ───────────────────────────────────────────────────────────────────
  async getNews(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: News[]; meta: { total: number; page: number; limit: number } }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = `admin/news${queryString ? `?${queryString}` : ''}`;
    return apiRequest<{ data: News[]; meta: { total: number; page: number; limit: number } }>(endpoint);
  },

  async createNews(formData: FormData): Promise<News> {
    return apiRequest<News>('admin/news', {
      method: 'POST',
      body: formData,
    });
  },

  async updateNews(id: string, formData: FormData): Promise<News> {
    return apiRequest<News>(`admin/news/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  async deleteNews(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`admin/news/${id}`, {
      method: 'DELETE',
    });
  },

  async patchNewsStatus(id: string, status: ContentStatus): Promise<News> {
    return apiRequest<News>(`admin/news/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // ─── Jobs ───────────────────────────────────────────────────────────────────
  async getJobs(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: Job[]; meta: { total: number; page: number; limit: number } }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = `admin/jobs${queryString ? `?${queryString}` : ''}`;
    return apiRequest<{ data: Job[]; meta: { total: number; page: number; limit: number } }>(endpoint);
  },

  async createJob(payload: {
    title: string;
    location?: string;
    employmentType?: string;
    description: string;
    requirements?: string;
    responsibilities?: string;
    closingDate?: string | null;
    status?: ContentStatus;
  }): Promise<Job> {
    return apiRequest<Job>('admin/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateJob(
    id: string,
    payload: {
      title?: string;
      location?: string;
      employmentType?: string;
      description?: string;
      requirements?: string;
      responsibilities?: string;
      closingDate?: string | null;
      status?: ContentStatus;
    }
  ): Promise<Job> {
    return apiRequest<Job>(`admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteJob(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`admin/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  async patchJobStatus(id: string, status: ContentStatus): Promise<Job> {
    return apiRequest<Job>(`admin/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // ─── Applications ───────────────────────────────────────────────────────────
  async getApplications(params?: {
    page?: number;
    limit?: number;
    jobId?: string;
    status?: string;
  }): Promise<{ data: Application[]; meta: { total: number; page: number; limit: number } }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.jobId) query.append('jobId', params.jobId);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = `admin/applications${queryString ? `?${queryString}` : ''}`;
    return apiRequest<{ data: Application[]; meta: { total: number; page: number; limit: number } }>(endpoint);
  },

  async getApplication(id: string): Promise<Application> {
    return apiRequest<Application>(`admin/applications/${id}`);
  },

  async getApplicationCV(id: string): Promise<{ cvUrl: string; cvFileName?: string; cvFileType?: string }> {
    return apiRequest<{ cvUrl: string; cvFileName?: string; cvFileType?: string }>(`admin/applications/${id}/cv`);
  },

  async patchApplicationStatus(id: string, applicationStatus: ApplicationStatus): Promise<Application> {
    return apiRequest<Application>(`admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ applicationStatus }),
    });
  },

  // ─── Enquiries ──────────────────────────────────────────────────────────────
  async getEnquiries(params?: {
    page?: number;
    limit?: number;
    enquiryType?: string;
  }): Promise<{ data: Enquiry[]; meta: { total: number; page: number; limit: number } }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.enquiryType && params.enquiryType !== 'ALL') query.append('enquiryType', params.enquiryType);

    const queryString = query.toString();
    const endpoint = `admin/enquiries${queryString ? `?${queryString}` : ''}`;
    return apiRequest<{ data: Enquiry[]; meta: { total: number; page: number; limit: number } }>(endpoint);
  },

  async getEnquiry(id: string): Promise<Enquiry> {
    return apiRequest<Enquiry>(`admin/enquiries/${id}`);
  },

  // ─── Dashboard Stats Aggregation ────────────────────────────────────────────
  async getDashboardStats(): Promise<DashboardStats> {
    const [productsRes, newsRes, jobsRes, appsRes, enquiriesRes] = await Promise.all([
      apiRequest<{ data: Product[]; meta: { total: number } }>('admin/products?limit=100'),
      apiRequest<{ data: News[]; meta: { total: number } }>('admin/news?limit=100'),
      apiRequest<{ data: Job[]; meta: { total: number } }>('admin/jobs?limit=100'),
      apiRequest<{ data: Application[]; meta: { total: number } }>('admin/applications?limit=100'),
      apiRequest<{ data: Enquiry[]; meta: { total: number } }>('admin/enquiries?limit=100'),
    ]);

    const products = Array.isArray(productsRes) ? productsRes : (productsRes.data || []);
    const news = Array.isArray(newsRes) ? newsRes : (newsRes.data || []);
    const jobs = Array.isArray(jobsRes) ? jobsRes : (jobsRes.data || []);
    const applications = Array.isArray(appsRes) ? appsRes : (appsRes.data || []);
    const enquiries = Array.isArray(enquiriesRes) ? enquiriesRes : (enquiriesRes.data || []);

    return {
      totalProducts: products.length,
      publishedProducts: products.filter((p) => p.status === 'PUBLISHED').length,
      totalNews: news.length,
      publishedNews: news.filter((n) => n.status === 'PUBLISHED').length,
      totalJobs: jobs.length,
      publishedJobs: jobs.filter((j) => j.status === 'PUBLISHED').length,
      totalApplications: applications.length,
      newApplications: applications.filter((a) => a.applicationStatus === 'NEW').length,
      totalEnquiries: enquiries.length,
    };
  },
};
