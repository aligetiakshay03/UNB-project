# UNB Web Application — Email Integration Architecture

**Date:** 2026-08-19  
**Status:** **PHASE 6A COMPLETE (Architecture & Providers Integrated) / PHASE 6B PENDING CLIENT CREDENTIALS**

---

## 1. Primary Objectives & Flows

Email notifications are dispatched automatically for two major public interactions:

### Flow A: Contact Form Enquiry
```text
Visitor Submits Form (Contact.tsx)
        ↓
POST /api/contact [CAPTCHA verified]
        ↓
Validation (Zod schema)
        ↓
PostgreSQL Persistence (prisma.enquiry.create)
        ↓
Email Service (emailService.sendContactNotification)
        ↓
Notification Recipient (EMAIL_CONTACT_TO: info@unb.co.za)
```

### Flow B: Job Application Submission
```text
Candidate Submits Application (JobDetail.tsx)
        ↓
POST /api/jobs/:jobId/apply [CAPTCHA verified + multipart/form-data]
        ↓
Private CV Upload (storageService.uploadPrivateFile)
        ↓
PostgreSQL Persistence (prisma.application.create)
        ↓
Email Service (emailService.sendApplicationNotification)
        ↓
HR Notification Recipient (EMAIL_CAREERS_TO: careers@unb.co.za)
```

---

## 2. Architecture & Provider Abstraction

The email subsystem is isolated under `backend/src/services/email/`:
- **`email.types.ts`**: Defines typed interfaces for `ContactEnquiryEmailData`, `JobApplicationEmailData`, and `EmailProvider`.
- **`email.service.ts`**: The central coordinator with brand-aligned HTML and plain text email templates.
- **`providers/mock.provider.ts`**: Safe development provider logging delivery metadata without sending external packets.
- **`providers/smtp.provider.ts`**: Production-ready provider using `nodemailer` (supports AWS SES, SendGrid SMTP, Mailgun, or corporate Exchange/Office365 SMTP).

### Configuration (`.env`)
```env
EMAIL_PROVIDER="mock"            # Options: mock | smtp | resend
EMAIL_FROM="no-reply@unb.co.za"
EMAIL_CONTACT_TO="info@unb.co.za"
EMAIL_CAREERS_TO="careers@unb.co.za"

# Required when EMAIL_PROVIDER=smtp
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="username"
SMTP_PASSWORD="password"
SMTP_SECURE=false
```

---

## 3. Failure Handling & Observability

- **Non-blocking Dispatch:** Database persistence is always committed first. If email dispatch encounters a network failure or invalid credentials, the user request is NOT rolled back or dropped; the user receives a clean `201 Created` response.
- **Observability:** Failed email attempts are logged to the backend console with `[EMAIL OBSERVABILITY] ...` including enquiry/application ID and error description, without exposing SMTP credentials or sensitive body content.

---

## 4. Current Status Matrix

| Component | Status | Details |
| :--- | :---: | :--- |
| Email Service Layer | ✅ Implemented | Factory and typed dispatch methods |
| Mock Provider | ✅ Implemented | Active by default for local development |
| SMTP Provider | ✅ Implemented | Ready for AWS SES / SendGrid / Mailgun credentials |
| Contact HTML Template | ✅ Implemented | Branded UNB styling with sender details & message |
| Careers HTML Template | ✅ Implemented | Branded UNB styling with candidate details & role |
| Live Client Credentials | ⏳ Pending Client | `EMAIL_PROVIDER=smtp` credentials to be provided by UNB |
