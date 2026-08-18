import { Router } from 'express';
import { submitEnquiry } from '../controllers/contact.controller';
import { contactRateLimit } from '../middleware/errorHandler';

const router = Router();

router.post('/', contactRateLimit, submitEnquiry);

export default router;
