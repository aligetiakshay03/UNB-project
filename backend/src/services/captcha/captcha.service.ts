import { CaptchaProvider, CaptchaVerifyResult } from './captcha.types';
import { MockCaptchaProvider } from './providers/mock.provider';
import { TurnstileCaptchaProvider } from './providers/turnstile.provider';
import { GoogleRecaptchaProvider } from './providers/recaptcha.provider';
import { HcaptchaProvider } from './providers/hcaptcha.provider';

class CaptchaService {
  private provider: CaptchaProvider;

  constructor() {
    const providerType = process.env.CAPTCHA_PROVIDER || 'mock';
    const secretKey = process.env.CAPTCHA_SECRET_KEY || '';
    const scoreThreshold = parseFloat(process.env.CAPTCHA_SCORE_THRESHOLD || '0.5');

    switch (providerType) {
      case 'turnstile':
        this.provider = new TurnstileCaptchaProvider(secretKey);
        break;
      case 'recaptcha':
        this.provider = new GoogleRecaptchaProvider(secretKey, scoreThreshold);
        break;
      case 'hcaptcha':
        this.provider = new HcaptchaProvider(secretKey);
        break;
      case 'mock':
      default:
        this.provider = new MockCaptchaProvider();
        break;
    }
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async verifyToken(token: string, remoteIp?: string): Promise<CaptchaVerifyResult> {
    return this.provider.verify(token, remoteIp);
  }
}

export const captchaService = new CaptchaService();
