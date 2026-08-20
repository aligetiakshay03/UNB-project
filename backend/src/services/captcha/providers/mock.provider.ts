import { CaptchaProvider, CaptchaVerifyResult } from '../captcha.types';

export class MockCaptchaProvider implements CaptchaProvider {
  public name = 'mock';

  public async verify(token: string): Promise<CaptchaVerifyResult> {
    if (!token || token.trim() === '') {
      return { success: false, error: 'Missing CAPTCHA challenge token' };
    }

    if (token === 'invalid-token' || token === 'fail-captcha') {
      return { success: false, error: 'CAPTCHA token verification rejected (mock)' };
    }

    return { success: true, score: 0.9 };
  }
}
