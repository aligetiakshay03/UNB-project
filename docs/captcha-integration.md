# UNB Web Application — CAPTCHA Integration Architecture

**Date:** 2026-08-19  
**Status:** **PHASE 6A COMPLETE (Architecture & Providers Integrated) / PHASE 6B PENDING CLIENT CREDENTIALS**

---

## 1. Protected Endpoints & Security Policy

CAPTCHA spam protection guards all publicly accessible state-changing form endpoints against automated bots and scrapers:
- `POST /api/contact`
- `POST /api/jobs/:jobId/apply`

### Security Guarantees
1. **Secret Key Isolation:** The CAPTCHA Secret Key is strictly stored on the backend server (`CAPTCHA_SECRET_KEY` in `backend/.env`) and is never sent or exposed to the client or browser bundle.
2. **Server-Side Verification:** The frontend challenge response is forwarded to the backend and verified against the chosen provider's verification API before database insertion.
3. **Multipart Ordering Resilience:** For job applications (`multipart/form-data`), the middleware inspects the `x-captcha-token` header (which can be validated before body parsing) or the parsed `req.body.captchaToken` field immediately after multer ingestion.

---

## 2. Architecture & Provider Drivers

The CAPTCHA subsystem is located under `backend/src/services/captcha/`:
- **`captcha.types.ts`**: Standardized verification interface (`success`, `score`, `error`).
- **`captcha.service.ts`**: Factory pattern instantiating the configured provider.
- **`providers/mock.provider.ts`**: Local development driver (accepts test tokens; rejects explicit `invalid-token` test cases).
- **`providers/turnstile.provider.ts`**: Cloudflare Turnstile integration (`challenges.cloudflare.com/turnstile/v0/siteverify`).
- **`providers/recaptcha.provider.ts`**: Google reCAPTCHA v2/v3 integration with score threshold checking.
- **`providers/hcaptcha.provider.ts`**: hCaptcha integration (`hcaptcha.com/siteverify`).
- **`middleware/captcha.ts`**: Express middleware returning `400 Bad Request` (`CAPTCHA_REQUIRED` / `CAPTCHA_INVALID`) upon failed validation.

---

## 3. Configuration (`.env`)

```env
# Options: mock | turnstile | recaptcha | hcaptcha
CAPTCHA_PROVIDER="mock"
CAPTCHA_SECRET_KEY="your-secret-key-here"
CAPTCHA_SCORE_THRESHOLD=0.5
```

---

## 4. Current Status Matrix

| Provider / Feature | Status | Details |
| :--- | :---: | :--- |
| Captcha Middleware | ✅ Implemented | Header & multipart body support |
| Mock Provider | ✅ Implemented | Active in development |
| Cloudflare Turnstile | ✅ Implemented | Ready for client site/secret keys |
| Google reCAPTCHA | ✅ Implemented | Ready for client site/secret keys |
| hCaptcha | ✅ Implemented | Ready for client site/secret keys |
| Live Client Credentials | ⏳ Pending Client | Turnstile or reCAPTCHA credentials to be provided by UNB |
