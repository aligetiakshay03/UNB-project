# UNB Web Application — Implementation Decisions

## Date: 2026-08-16
## Phase: 0 — Discovery & Reference Audit

---

Every implementation decision is documented below. Items marked "Client confirmation required: Yes" must NOT be treated as confirmed until the client responds.

---

## D-001: Store Contact Enquiries in PostgreSQL

| Field | Value |
|-------|-------|
| Decision | Store all contact form submissions in the `enquiries` table |
| Reason | Enables admin review, prevents data loss if email fails, provides audit trail |
| Impact | Requires database table, admin viewer, GDPR/privacy considerations |
| Client confirmation required? | **Yes** — scope lists database storage as "optional" |
| Current status | Proposed — implementing with storage by default, can be disabled |

---

## D-002: Store Job Applications in PostgreSQL

| Field | Value |
|-------|-------|
| Decision | Store all job applications in the `applications` table with CV file metadata |
| Reason | Allows admin to review, track, and manage applications internally |
| Impact | Requires database table, file storage integration, admin viewer |
| Client confirmation required? | **Yes** — scope says "email notification and/or application storage" |
| Current status | Proposed — implementing both storage and email notification |

---

## D-003: Send Email Notifications for Contact + Applications

| Field | Value |
|-------|-------|
| Decision | Send email notifications when a contact enquiry or job application is submitted |
| Reason | Immediate awareness for UNB staff without needing to check admin dashboard |
| Impact | Requires email service integration, failure handling |
| Client confirmation required? | **Yes** — email recipient addresses needed |
| Current status | Proposed — email service designed as configurable; disabled by default until provider confirmed |

---

## D-004: Use Prisma ORM Exclusively

| Field | Value |
|-------|-------|
| Decision | All database operations use Prisma — no raw SQL or node-postgres |
| Reason | Type safety, migration management, consistent data access layer |
| Impact | All queries go through Prisma client; schema defined in `schema.prisma` |
| Client confirmation required? | No — implementation detail |
| Current status | **Confirmed** (mandatory per architecture corrections) |

---

## D-005: Category → Product → Variant Data Hierarchy

| Field | Value |
|-------|-------|
| Decision | Use `Category → Product → Variant` as the product content hierarchy |
| Reason | Best matches the PDF layout where products are grouped by category (Sorghum, Non-Alcoholic) with variants (flavors/sizes) |
| Impact | Requires `categories` table; products reference a category |
| Client confirmation required? | **Yes** — see `docs/content-model.md` for open questions about brand hierarchy |
| Current status | Proposed — derived from PDF analysis |

---

## D-006: Application Status Tracking (Internal Admin)

| Field | Value |
|-------|-------|
| Decision | Add `application_status` field with values: NEW, REVIEWING, SHORTLISTED, REJECTED, HIRED |
| Reason | Allows UNB admin staff to track application progress internally |
| Impact | Admin-only feature; never exposed on public website |
| Client confirmation required? | **Yes** — exact workflow statuses should be confirmed |
| Current status | Proposed — reasonable default workflow |

---

## D-007: Admin Roles (ADMIN / EDITOR)

| Field | Value |
|-------|-------|
| Decision | Two roles: ADMIN (full access, delete, user management), EDITOR (create, update, publish) |
| Reason | System design mentions roles but doesn't define permissions in detail |
| Impact | Authorization middleware checks role on destructive operations |
| Client confirmation required? | **Yes** — exact roles and permissions |
| Current status | Proposed — minimal viable permission model |

---

## D-008: CAPTCHA Provider

| Field | Value |
|-------|-------|
| Decision | Design CAPTCHA as a configurable integration with mock for development |
| Reason | Scope requires CAPTCHA/spam protection; specific provider not specified |
| Impact | Backend middleware verifies CAPTCHA token; frontend renders widget |
| Client confirmation required? | **Yes** — which provider (reCAPTCHA, hCaptcha, Turnstile, etc.) |
| Current status | Proposed — architected as pluggable; mock in dev, real in production |

---

## D-009: File Storage Provider

| Field | Value |
|-------|-------|
| Decision | Design file storage as a service abstraction; local storage for dev only |
| Reason | Production files must not live on the application server filesystem |
| Impact | Storage service interface with provider-specific implementation |
| Client confirmation required? | **Yes** — which provider (S3, GCS, Azure Blob, Cloudinary, etc.) |
| Current status | Proposed — local adapter for dev, production adapter TBD |

---

## D-010: Email Service Provider

| Field | Value |
|-------|-------|
| Decision | Design email as a service abstraction with configurable provider |
| Reason | Scope requires email notifications; specific provider not specified |
| Impact | Email service interface; disabled until provider configured |
| Client confirmation required? | **Yes** — which provider (SendGrid, Mailgun, SES, Resend, etc.) |
| Current status | Proposed — service designed, provider TBD |

---

## D-011: Age Gate

| Field | Value |
|-------|-------|
| Decision | TBD — Delta reference site uses age gate for alcohol content |
| Reason | UNB produces alcoholic beverages; South African law may require age verification |
| Impact | Would need an age-gate overlay before website access |
| Client confirmation required? | **Yes** — is age verification required? |
| Current status | Open question — NOT implementing until confirmed |

---

## D-012: CSS Framework

| Field | Value |
|-------|-------|
| Decision | Use Tailwind CSS for styling |
| Reason | System design mentions CSS/Tailwind as options; Tailwind provides utility-first approach matching the design tokens |
| Impact | All styling via Tailwind utility classes with custom theme configuration |
| Client confirmation required? | No — implementation detail |
| Current status | **Confirmed** |

---

## D-013: Hosting / Deployment Platform

| Field | Value |
|-------|-------|
| Decision | TBD |
| Reason | Not specified in client scope |
| Impact | Affects file storage, email, CAPTCHA, domain, SSL configuration |
| Client confirmation required? | **Yes** |
| Current status | Open question |
