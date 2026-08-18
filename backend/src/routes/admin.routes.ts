import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { imageUpload } from '../middleware/upload';

// Admin controllers
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminPatchProductStatus,
} from '../controllers/admin/products.admin.controller';
import {
  adminListNews,
  adminCreateNews,
  adminUpdateNews,
  adminDeleteNews,
  adminPatchNewsStatus,
} from '../controllers/admin/news.admin.controller';
import {
  adminListJobs,
  adminCreateJob,
  adminUpdateJob,
  adminDeleteJob,
  adminPatchJobStatus,
} from '../controllers/admin/jobs.admin.controller';
import {
  adminListApplications,
  adminGetApplication,
  adminGetApplicationCV,
  adminPatchApplicationStatus,
} from '../controllers/admin/applications.admin.controller';
import {
  adminListEnquiries,
  adminGetEnquiry,
} from '../controllers/admin/enquiries.admin.controller';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// ─── Products ─────────────────────────────────────────────────────────────────
router.get('/products', adminListProducts);
router.post('/products', imageUpload.single('image'), adminCreateProduct);
router.put('/products/:id', imageUpload.single('image'), adminUpdateProduct);
router.delete('/products/:id', requireAdmin, adminDeleteProduct);
router.patch('/products/:id/status', adminPatchProductStatus);

// ─── News ─────────────────────────────────────────────────────────────────────
router.get('/news', adminListNews);
router.post('/news', imageUpload.single('image'), adminCreateNews);
router.put('/news/:id', imageUpload.single('image'), adminUpdateNews);
router.delete('/news/:id', requireAdmin, adminDeleteNews);
router.patch('/news/:id/status', adminPatchNewsStatus);

// ─── Jobs ─────────────────────────────────────────────────────────────────────
router.get('/jobs', adminListJobs);
router.post('/jobs', adminCreateJob);
router.put('/jobs/:id', adminUpdateJob);
router.delete('/jobs/:id', requireAdmin, adminDeleteJob);
router.patch('/jobs/:id/status', adminPatchJobStatus);

// ─── Applications (read-only + status patch) ──────────────────────────────────
router.get('/applications', adminListApplications);
router.get('/applications/:id', adminGetApplication);
router.get('/applications/:id/cv', adminGetApplicationCV);
router.patch('/applications/:id/status', adminPatchApplicationStatus);

// ─── Enquiries (read-only) ────────────────────────────────────────────────────
router.get('/enquiries', adminListEnquiries);
router.get('/enquiries/:id', adminGetEnquiry);

export default router;
