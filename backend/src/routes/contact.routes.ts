import { Router } from 'express';
import { submitEnquiry } from '../controllers/contact.controller';
import { contactRateLimit } from '../middleware/errorHandler';
import { verifyCaptcha } from '../middleware/captcha';

const router = Router();

router.post('/', contactRateLimit, verifyCaptcha, submitEnquiry);

export default router;
