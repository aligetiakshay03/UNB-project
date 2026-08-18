import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Generic error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ERROR]', err.message, err.stack);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
  });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      message: `Cannot ${req.method} ${req.path}`,
    },
  });
};

// Rate limiters
export const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: { message: 'Too many requests. Please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const applicationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: { message: 'Too many applications. Please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: { message: 'Too many login attempts. Please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});
