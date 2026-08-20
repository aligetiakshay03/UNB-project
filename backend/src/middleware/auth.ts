import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;

    // CSRF Protection for cookie-based state-changing requests
    const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (mutatingMethods.includes(req.method.toUpperCase())) {
      const origin = req.headers.origin || req.headers.referer;
      const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      if (origin && !origin.startsWith(allowedOrigin) && !origin.includes('localhost')) {
        console.warn(`[SECURITY CSRF] Blocked cross-origin mutating request from: ${origin}`);
        res.status(403).json({ error: { message: 'Cross-origin request blocked (CSRF validation)' } });
        return;
      }
    }
  }

  if (!token) {
    res.status(401).json({ error: { message: 'Authentication required' } });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({ error: { message: 'User not found or token invalidated' } });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: { message: 'Invalid token' } });
      return;
    }
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: { message: 'Token expired' } });
      return;
    }
    next(err);
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ error: { message: 'Admin access required' } });
    return;
  }
  next();
};
