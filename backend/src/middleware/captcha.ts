import { Request, Response, NextFunction } from 'express';
import { captchaService } from '../services/captcha/captcha.service';

/**
 * Express middleware to verify CAPTCHA token on protected endpoints.
 * Checks header `x-captcha-token` or body field `captchaToken` / `captcha_token`.
 */
export const verifyCaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const isProd = process.env.NODE_ENV === 'production';
  const provider = captchaService.getProviderName();

  // Extract token from header or body
  const headerToken = req.headers['x-captcha-token'] as string | undefined;
  const bodyToken = (req.body?.captchaToken || req.body?.captcha_token) as string | undefined;
  const token = headerToken || bodyToken;

  // In development with mock provider, allow pass-through if token omitted unless explicitly testing invalid
  if (provider === 'mock' && !token && !isProd) {
    next();
    return;
  }

  if (!token) {
    res.status(400).json({
      error: {
        message: 'CAPTCHA challenge token is required',
        code: 'CAPTCHA_REQUIRED',
      },
    });
    return;
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
  const result = await captchaService.verifyToken(token, clientIp);

  if (!result.success) {
    res.status(400).json({
      error: {
        message: result.error || 'CAPTCHA verification failed',
        code: 'CAPTCHA_INVALID',
      },
    });
    return;
  }

  next();
};
