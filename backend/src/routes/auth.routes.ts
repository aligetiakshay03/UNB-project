import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { loginRateLimit } from '../middleware/errorHandler';

const router = Router();

router.post('/login', loginRateLimit, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
