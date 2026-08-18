# UNB Web Application — Open Questions

## Date: 2026-08-16
## Phase: 0 — Discovery & Reference Audit

---

These questions require client input before implementation can proceed confidently. Items are grouped by priority.

---

## High Priority (Blocks implementation decisions)

### Q-001: Brand / Product Hierarchy
**Question:** Are Chibuku, Ijuba, Leopard, and Ukhozi Mageu considered **brands** or **products**? The Home page presents them as distinct brands, but the Brands page presents items by category with format variants.

**Impact:** Determines the database structure (Category → Product → Variant vs Brand → Product → Variant).

**Current assumption:** Category → Product → Variant (see `docs/content-model.md`).

---

### Q-002: Contact Form — Store in Database?
**Question:** Should contact enquiries be stored in the database, or sent via email only?

**Impact:** If email-only, no `enquiries` table needed and no admin viewer. If stored, admin can review submissions even if email fails.

**Current assumption:** Store in database AND send email.

---

### Q-003: Job Applications — Store in Database?
**Question:** Should job applications be stored in the database with CV file references, or sent via email only?

**Impact:** If email-only, no `applications` table or CV storage needed. If stored, admin can review, filter, and track applications.

**Current assumption:** Store in database AND send email.

---

### Q-004: Age Gate Requirement
**Question:** Does the UNB website require an age verification gate before visitors can access the site? (Delta's Zimbabwe site has one for alcohol compliance.)

**Impact:** If yes, a modal/overlay must be implemented as the first interaction. If no, site loads directly.

**Current assumption:** Not implementing until confirmed.

---

### Q-005: CAPTCHA Provider
**Question:** Which CAPTCHA/spam protection service should be used? Options: Google reCAPTCHA v3, hCaptcha, Cloudflare Turnstile, or other.

**Impact:** Determines frontend widget and backend verification integration.

**Current assumption:** Architected as pluggable; no specific provider selected.

---

## Medium Priority (Can proceed with defaults, but should confirm)

### Q-006: Email Service Provider
**Question:** Which email service should be used for notifications? Options: SendGrid, Mailgun, Amazon SES, Resend, or other.

**Impact:** Determines the email service adapter implementation.

**Current assumption:** Service designed as configurable; disabled until provider is set.

---

### Q-007: File Storage Provider
**Question:** Where should uploaded files (product images, CV documents) be stored? Options: AWS S3, Google Cloud Storage, Azure Blob, Cloudinary, or other.

**Impact:** Determines the storage service adapter implementation.

**Current assumption:** Local filesystem for development; production provider TBD.

---

### Q-008: Contact Email Recipients
**Question:** Which email address(es) should receive contact enquiry notifications?

**Current assumption:** `info@unb.co.za` (placeholder — needs confirmation).

---

### Q-009: Application Email Recipients
**Question:** Which email address(es) should receive job application notifications?

**Current assumption:** `careers@unb.co.za` (placeholder — needs confirmation).

---

### Q-010: Admin User Roles
**Question:** What admin roles are needed? The system design mentions ADMIN and EDITOR. What can each role do?

**Current assumption:**
- ADMIN: Full access (create, update, delete, publish, manage users)
- EDITOR: Create, update, publish (no delete, no user management)

---

### Q-011: Enquiry Types
**Question:** What enquiry types should be available in the contact form dropdown?

**Current assumption:** General, Trade, Media, Other

---

### Q-012: Hosting Platform
**Question:** Where will the application be hosted?

**Impact:** Affects deployment scripts, environment configuration, file storage, SSL setup.

**Current assumption:** Not decided.

---

## Low Priority (Can be addressed later)

### Q-013: Analytics
**Question:** Should Google Analytics or another analytics platform be integrated?

**Impact:** Script injection in HTML head, cookie consent considerations.

**Current assumption:** Not implementing until confirmed.

---

### Q-014: Cookie Consent
**Question:** Does the site need a cookie consent banner? (May depend on South African POPIA requirements.)

**Current assumption:** Not implementing until confirmed.

---

### Q-015: Social Media URLs
**Question:** What are UNB's official social media profile URLs?

**Impact:** Utility bar social links, footer social links.

**Current assumption:** Placeholder links; visible in PDF utility bar but exact URLs not provided.

---

### Q-016: Logo & Brand Assets
**Question:** Can the client provide the UNB logo in SVG and PNG format, along with any other brand assets?

**Impact:** Currently using placeholder references.

**Current assumption:** Placeholder until provided.

---

### Q-017: Product Images
**Question:** Will the client provide product photography, or should the system rely entirely on admin-uploaded images?

**Impact:** Seed data and initial content.

**Current assumption:** Admin uploads all product images through CMS.

---

### Q-018: Sustainability Content
**Question:** What specific sustainability content should appear on the Sustainability page?

**Impact:** Currently using `[CLIENT TO PROVIDE]` placeholders. No invented statistics or claims.

**Current assumption:** Placeholder content only.

---

### Q-019: PDF/Document Downloads
**Question:** Does the News & Media section need to support PDF/document downloads? The scope mentions "optional PDF/document downloads."

**Impact:** Additional file upload and download functionality for news articles.

**Current assumption:** Not implementing in MVP unless confirmed.

---

### Q-020: Domain
**Question:** What domain will the production site use?

**Impact:** CORS, canonical URLs, SEO, SSL certificate.

**Current assumption:** Not decided.
