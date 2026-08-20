export interface CaptchaVerifyResult {
  success: boolean;
  score?: number;
  error?: string;
}

export interface CaptchaProvider {
  name: string;
  verify(token: string, remoteIp?: string): Promise<CaptchaVerifyResult>;
}
