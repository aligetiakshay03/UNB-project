export type ContentStatus = 'DRAFT' | 'PUBLISHED';
export type ApplicationStatus = 'NEW' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
export type UserRole = 'ADMIN' | 'EDITOR';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  category?: Category;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  isFeatured: boolean;
  status: ContentStatus;
  displayOrder: number;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  category?: string;
  summary?: string;
  content: string;
  featuredImage?: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  location?: string;
  employmentType?: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  closingDate?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  name: string;
  email: string;
  phone?: string;
  coverMessage?: string;
  cvUrl?: string;
  cvFileName?: string;
  cvFileSize?: number;
  cvFileType?: string;
  applicationStatus: ApplicationStatus;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  enquiryType: string;
  message: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
