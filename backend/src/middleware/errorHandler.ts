import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';

// Generic error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: {
          message: 'File size exceeds allowed limit (maximum 5MB)',
        },
      });
      return;
    }
    res.status(400).json({
      error: {
        message: err.message,
      },
    });
    return;
  }

  if (err.message && (err.message.includes('Only PDF') || err.message.includes('accepted'))) {
    res.status(400).json({
      error: {
        message: err.message,
      },
    });
    return;
  }

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
  max: 10,
  statusCode: 429,
  message: { error: { message: 'Too many contact submissions. Please try again in 15 minutes.', code: 'RATE_LIMIT_EXCEEDED' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const applicationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  statusCode: 429,
  message: { error: { message: 'Too many application submissions. Please try again in 15 minutes.', code: 'RATE_LIMIT_EXCEEDED' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  statusCode: 429,
  message: { error: { message: 'Too many login attempts. Please try again in 15 minutes.', code: 'RATE_LIMIT_EXCEEDED' } },
  standardHeaders: true,
  legacyHeaders: false,
});
