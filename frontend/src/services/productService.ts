import { apiRequest } from './apiClient';
import type { Product } from '../types';

export const productService = {
  /**
   * Fetch all published products, optionally filtered by category slug or featured flag
   */
  async getProducts(params?: { category?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<Product[]>(`products${qs}`);
  },

  /**
   * Fetch a single product by its slug (includes variants & category)
   */
  async getProductBySlug(slug: string): Promise<Product> {
    return apiRequest<Product>(`products/${slug}`);
  },
};
