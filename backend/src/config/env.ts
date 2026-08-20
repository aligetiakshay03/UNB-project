export interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  
  // Email
  EMAIL_PROVIDER: 'mock' | 'smtp' | 'resend';
  EMAIL_FROM: string;
  EMAIL_CONTACT_TO: string;
  EMAIL_CAREERS_TO: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  SMTP_SECURE?: boolean;

  // CAPTCHA
  CAPTCHA_PROVIDER: 'mock' | 'turnstile' | 'recaptcha' | 'hcaptcha';
  CAPTCHA_SECRET_KEY?: string;
  CAPTCHA_SCORE_THRESHOLD?: number;

  // Storage
  STORAGE_PROVIDER: 'local-private' | 's3' | 'supabase';
  STORAGE_BUCKET?: string;
  STORAGE_REGION?: string;
  STORAGE_ACCESS_KEY?: string;
  STORAGE_SECRET_KEY?: string;
  STORAGE_ENDPOINT?: string;
}

export function validateEnv(): EnvConfig {
  const isProd = process.env.NODE_ENV === 'production';
  const errors: string[] = [];

  const PORT = parseInt(process.env.PORT || '5000', 10);
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const DATABASE_URL = process.env.DATABASE_URL || '';
  const JWT_SECRET = process.env.JWT_SECRET || '';
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (!DATABASE_URL) {
    errors.push('DATABASE_URL is required');
  }

  if (!JWT_SECRET) {
    errors.push('JWT_SECRET is required');
  } else if (isProd && JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long in production');
  }

  // Email Config
  const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || 'mock') as EnvConfig['EMAIL_PROVIDER'];
  const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@unb.co.za';
  const EMAIL_CONTACT_TO = process.env.EMAIL_CONTACT_TO || 'info@unb.co.za';
  const EMAIL_CAREERS_TO = process.env.EMAIL_CAREERS_TO || 'careers@unb.co.za';

  if (isProd && EMAIL_PROVIDER === 'mock') {
    console.warn('[SECURITY WARNING] EMAIL_PROVIDER is set to "mock" in production mode.');
  }

  if (EMAIL_PROVIDER === 'smtp') {
    if (!process.env.SMTP_HOST) errors.push('SMTP_HOST is required when EMAIL_PROVIDER=smtp');
    if (!process.env.SMTP_PORT) errors.push('SMTP_PORT is required when EMAIL_PROVIDER=smtp');
  }

  // CAPTCHA Config
  const CAPTCHA_PROVIDER = (process.env.CAPTCHA_PROVIDER || 'mock') as EnvConfig['CAPTCHA_PROVIDER'];
  const CAPTCHA_SECRET_KEY = process.env.CAPTCHA_SECRET_KEY;
  const CAPTCHA_SCORE_THRESHOLD = parseFloat(process.env.CAPTCHA_SCORE_THRESHOLD || '0.5');

  if (isProd && CAPTCHA_PROVIDER === 'mock') {
    console.warn('[SECURITY WARNING] CAPTCHA_PROVIDER is set to "mock" in production mode.');
  }

  if (CAPTCHA_PROVIDER !== 'mock' && !CAPTCHA_SECRET_KEY) {
    errors.push(`CAPTCHA_SECRET_KEY is required when CAPTCHA_PROVIDER=${CAPTCHA_PROVIDER}`);
  }

  // Storage Config
  const STORAGE_PROVIDER = (process.env.STORAGE_PROVIDER || 'local-private') as EnvConfig['STORAGE_PROVIDER'];
  const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
  const STORAGE_REGION = process.env.STORAGE_REGION;
  const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;
  const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY;
  const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT;

  if (STORAGE_PROVIDER === 's3') {
    if (!STORAGE_BUCKET) errors.push('STORAGE_BUCKET is required when STORAGE_PROVIDER=s3');
    if (!STORAGE_ACCESS_KEY) errors.push('STORAGE_ACCESS_KEY is required when STORAGE_PROVIDER=s3');
    if (!STORAGE_SECRET_KEY) errors.push('STORAGE_SECRET_KEY is required when STORAGE_PROVIDER=s3');
  }

  if (errors.length > 0) {
    const errorMsg = `[Configuration Error] Fatal environment configuration error(s):\n  - ${errors.join('\n  - ')}`;
    if (isProd) {
      throw new Error(errorMsg);
    } else {
      console.error(errorMsg);
    }
  }

  return {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_SECRET,
    FRONTEND_URL,
    EMAIL_PROVIDER,
    EMAIL_FROM,
    EMAIL_CONTACT_TO,
    EMAIL_CAREERS_TO,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_SECURE: process.env.SMTP_SECURE === 'true',
    CAPTCHA_PROVIDER,
    CAPTCHA_SECRET_KEY,
    CAPTCHA_SCORE_THRESHOLD,
    STORAGE_PROVIDER,
    STORAGE_BUCKET,
    STORAGE_REGION,
    STORAGE_ACCESS_KEY,
    STORAGE_SECRET_KEY,
    STORAGE_ENDPOINT,
  };
}
