import { Router } from 'express';
import { getJobs, getJobBySlug } from '../controllers/jobs.controller';
import { applyForJob } from '../controllers/applications.controller';
import { cvUpload } from '../middleware/upload';
import { applicationRateLimit } from '../middleware/errorHandler';

const router = Router();

router.get('/', getJobs);
router.get('/:slug', getJobBySlug);

// Application uses jobId not slug (to match DB relation)
router.post(
  '/:jobId/apply',
  applicationRateLimit,
  cvUpload.single('cv'),
  applyForJob
);

export default router;
