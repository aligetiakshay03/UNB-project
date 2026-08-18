import { z } from 'zod';

// ─── Contact Enquiry ─────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Must be a valid email'),
  phone: z.string().max(50).optional(),
  enquiryType: z.enum(['General', 'Trade', 'Media', 'Other'], {
    errorMap: () => ({ message: 'enquiryType must be one of: General, Trade, Media, Other' }),
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ─── Job Application ──────────────────────────────────────────────────────────

export const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Must be a valid email'),
  phone: z.string().max(50).optional(),
  coverMessage: z.string().max(2000).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Product (Admin) ─────────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  categoryId: z.string().uuid('Invalid category ID'),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  isFeatured: z
    .union([z.boolean(), z.string()])
    .transform((v) => (typeof v === 'string' ? v === 'true' : v))
    .optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  displayOrder: z
    .union([z.number(), z.string()])
    .transform(Number)
    .optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

// ─── News (Admin) ─────────────────────────────────────────────────────────────

export const newsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  category: z.string().max(100).optional(),
  summary: z.string().max(500).optional(),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  publishedAt: z.string().datetime({ offset: true }).optional().nullable(),
});

export type NewsInput = z.infer<typeof newsSchema>;

// ─── Job (Admin) ──────────────────────────────────────────────────────────────

export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  location: z.string().max(255).optional(),
  employmentType: z.string().max(100).optional(),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  closingDate: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export type JobInput = z.infer<typeof jobSchema>;

// ─── Status Patch ─────────────────────────────────────────────────────────────

export const contentStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

export const applicationStatusSchema = z.object({
  applicationStatus: z.enum(['NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED']),
});

// ─── Pagination helpers ───────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.string().optional().transform((v) => (v ? Math.max(1, parseInt(v, 10)) : 1)),
  limit: z.string().optional().transform((v) => {
    const n = v ? parseInt(v, 10) : 10;
    return Math.min(100, Math.max(1, n));
  }),
});
