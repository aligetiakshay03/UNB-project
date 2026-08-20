import { CaptchaProvider, CaptchaVerifyResult } from '../captcha.types';

export class TurnstileCaptchaProvider implements CaptchaProvider {
  public name = 'turnstile';
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  public async verify(token: string, remoteIp?: string): Promise<CaptchaVerifyResult> {
    if (!token) {
      return { success: false, error: 'Missing Cloudflare Turnstile token' };
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', this.secretKey);
      formData.append('response', token);
      if (remoteIp) formData.append('remoteip', remoteIp);

      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
      if (!data.success) {
        return {
          success: false,
          error: data['error-codes']?.join(', ') || 'Turnstile verification failed',
        };
      }

      return { success: true };
    } catch (err) {
      const errMsg = (err as Error).message || 'Turnstile verification request failed';
      console.error('[CAPTCHA TURNSTILE ERROR]', errMsg);
      return { success: false, error: errMsg };
    }
  }
}
