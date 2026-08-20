import { CaptchaProvider, CaptchaVerifyResult } from '../captcha.types';

export class GoogleRecaptchaProvider implements CaptchaProvider {
  public name = 'recaptcha';
  private secretKey: string;
  private minScore: number;

  constructor(secretKey: string, minScore = 0.5) {
    this.secretKey = secretKey;
    this.minScore = minScore;
  }

  public async verify(token: string, remoteIp?: string): Promise<CaptchaVerifyResult> {
    if (!token) {
      return { success: false, error: 'Missing Google reCAPTCHA token' };
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', this.secretKey);
      formData.append('response', token);
      if (remoteIp) formData.append('remoteip', remoteIp);

      const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = (await res.json()) as {
        success: boolean;
        score?: number;
        'error-codes'?: string[];
      };

      if (!data.success) {
        return {
          success: false,
          error: data['error-codes']?.join(', ') || 'reCAPTCHA verification failed',
        };
      }

      if (typeof data.score === 'number' && data.score < this.minScore) {
        return {
          success: false,
          score: data.score,
          error: `reCAPTCHA score ${data.score} below threshold ${this.minScore}`,
        };
      }

      return { success: true, score: data.score };
    } catch (err) {
      const errMsg = (err as Error).message || 'reCAPTCHA verification request failed';
      console.error('[CAPTCHA RECAPTCHA ERROR]', errMsg);
      return { success: false, error: errMsg };
    }
  }
}
