import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import { validateEnv } from './config/env';

// Validate environment on startup
const env = validateEnv();

// Routes
import productRoutes from './routes/products.routes';
import newsRoutes from './routes/news.routes';
import jobRoutes from './routes/jobs.routes';
import contactRoutes from './routes/contact.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = env.PORT || 5000;

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
    noSniff: true,
    hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
  })
);
app.disable('x-powered-by');
app.use(
  cors({
    origin: env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Static Media Uploads (Public assets only — CVs are private) ──────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'UNB Web Application API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Public Routes ────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contact', contactRoutes);

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Admin Routes ─────────────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`[UNB Backend] Server running on port ${PORT}`);
  console.log(`[UNB Backend] Health check: http://localhost:${PORT}/api/health`);
});

export default app;
