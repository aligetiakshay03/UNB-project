import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

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
const PORT = process.env.PORT || 3001;

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
