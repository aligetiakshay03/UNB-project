import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { loginSchema } from '../validators/schemas';

/**
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
      });
      return;
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Use same message for both wrong email and wrong password (prevents user enumeration)
      res.status(401).json({ error: { message: 'Invalid credentials' } });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: { message: 'Invalid credentials' } });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const signOptions: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'],
    };
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      signOptions
    );

    res.json({
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Stateless JWT — client discards token. Server-side blacklisting is an
 * implementation decision to be resolved if required.
 */
export const logout = (req: Request, res: Response): void => {
  res.json({ data: { message: 'Logged out' } });
};

/**
 * GET /api/auth/me
 */
export const getMe = (req: Request & { user?: { id: string; email: string; role: string } }, res: Response): void => {
  res.json({ data: req.user });
};
