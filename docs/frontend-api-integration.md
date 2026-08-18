# Phase 4 — Frontend / API Integration Document

**Date:** 2026-08-18  
**Phase:** 4 — Frontend / API Integration  
**Backend Base URL:** `http://localhost:5000/api` (configured via `VITE_API_BASE_URL`)  
**Frontend Framework:** React 19 + TypeScript + Vite  

---

## 1. Integration Status Matrix

| Page / Component | Route | Target API Endpoint | Status | Loading State | Error State | Empty State | Visual Regression |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Brands Page** | `/brands` | `GET /api/products` | **COMPLETE** | Custom Spinner | Alert Banner | Friendly Message | **PASS** (Approved UI intact) |
| **Brand Detail** | `/brands/:slug` | `GET /api/products/:slug` | **COMPLETE** | Fullpage Loader | 404 Back Screen | Fallback Specs | **PASS** (Highlights & variants intact) |
| **News Listing** | `/news` | `GET /api/news` | **COMPLETE** | Custom Spinner | Alert Banner | Friendly Message | **PASS** (Pill filters intact) |
| **News Detail** | `/news/:slug` | `GET /api/news/:slug` | **COMPLETE** | Fullpage Loader | 404 Back Screen | Empty Paragraphs | **PASS** (Article layout intact) |
| **Careers Listing** | `/careers` | `GET /api/jobs` | **COMPLETE** | Custom Spinner | Alert Banner | Search empty box | **PASS** (Search & type filter intact) |
| **Job Detail** | `/careers/:slug` | `GET /api/jobs/:slug` | **COMPLETE** | Fullpage Loader | 404 Back Screen | Fallback lists | **PASS** (Metadata bar intact) |
| **Job Application** | Modal in `/careers/:slug` | `POST /api/jobs/:jobId/apply` | **COMPLETE** | Submitting state | Validation alerts | N/A | **PASS** (Modal & CV upload intact) |
| **Contact Form** | `/contact` | `POST /api/contact` | **COMPLETE** | Submitting state | Validation alerts | N/A | **PASS** (Form & Success state intact) |
| **Admin Login** | `/admin/login` | `POST /api/auth/login`, `GET /api/auth/me` | **COMPLETE** | Signing in spinner | Alert Banner | N/A | **PASS** (Portal UI intact) |

---

## 2. API Services Layer Architecture

Standardized client-side service modules located in `frontend/src/services/`:

- `apiClient.ts`: Generic `fetch()` wrapper handling `VITE_API_BASE_URL`, Authorization headers, 401 token expiry cleanup, and `ApiException` error parsing.
- `productService.ts`: `getProducts({ category, featured })` and `getProductBySlug(slug)`.
- `newsService.ts`: `getNews({ category, page, limit })` and `getNewsBySlug(slug)`.
- `jobService.ts`: `getJobs({ type, page, limit })` and `getJobBySlug(slug)`.
- `applicationService.ts`: `submitApplication(jobId, formData)` with `multipart/form-data` CV upload.
- `contactService.ts`: `submitEnquiry(payload)`.
- `authService.ts`: `login(credentials)`, `getMe()`, `logout()`, `isAuthenticated()`.

---

## 3. Storage Architecture: Application & CV Data

```text
Browser (Job Application Form)
   │
   ▼
Express API (POST /api/jobs/:jobId/apply)
   │
   ├───► PostgreSQL (Supabase)
   │      │
   │      ├──► Candidate Record (name, email, phone, coverMessage, status)
   │      └──► CV Metadata (cvFileName, cvFileSize, cvFileType, cvUrl)
   │
   └───► File Storage
          │
          └──► CV File (Current: Temporary backend multer handling;
                        Production: Private object storage with authenticated access)
```

> **Important Architecture Note:**  
> Application data and CV metadata are persisted through the API into PostgreSQL. CV files are currently handled by the backend's temporary local-storage implementation. Binary file contents are never stored directly in the database.
>
> **CV Production Status:** `PROVISIONAL — NOT PRODUCTION READY`. Private cloud object storage (e.g. S3 / Supabase Storage with signed URLs or secure backend streaming) is pending client provider selection. CV files are never exposed as public unrestricted URLs.

---

## 4. Authentication & Session Architecture

- **Token Type:** Stateless JWT (8h lifetime).
- **Client Storage:** `localStorage` (`unb_auth_token`).
- **Session Restoration:** On mount, `AdminLogin.tsx` verifies session with `GET /api/auth/me`.
- **Token Expiry:** When API returns 401 Unauthorized, `apiClient.ts` clears `unb_auth_token`, immediately returning client to unauthenticated state.
- **Logout:** Client discards token via `localStorage.removeItem('unb_auth_token')` and notifies `POST /api/auth/logout`.

---

## 5. Approved Visual Design Freeze Verification

- **Layout & Structure**: Maintained exact container widths, padding, margins, section orders, and responsive subgrid / flex layouts.
- **Typography & Colors**: Preserved `unb-navy` (`#132B5B`), `unb-amber` (`#D99B26`), `unb-sand` (`#F7F6F2`), and font hierarchies.
- **Imagery & Fallbacks**: Used verified reference photography assets (`/images/unb-reference/...`) as high-fidelity fallbacks whenever API records have unpopulated/placeholder image URLs.

---

## 6. Phase 4 Exit Criteria Checklist

- [x] Products connected to real API (`GET /api/products`)
- [x] Product details connected (`GET /api/products/:slug`)
- [x] News connected (`GET /api/news`)
- [x] News detail connected (`GET /api/news/:slug`)
- [x] Careers connected (`GET /api/jobs`)
- [x] Job detail connected (`GET /api/jobs/:slug`)
- [x] Contact form connected (`POST /api/contact`)
- [x] Job application connected (`POST /api/jobs/:jobId/apply`)
- [x] Loading states verified on all dynamic pages
- [x] Error states (400, 401, 404, 500, network) verified
- [x] Empty states verified
- [x] Frontend types synchronized with backend Prisma models
- [x] No visual regression
- [x] No approved visual reference assets replaced
- [x] Responsive design preserved
- [x] Frontend build passes (`npm run build` exits 0)
- [x] Backend build passes (`npm run build` exits 0)
- [x] Backend health check verified (`GET /api/health` 200 OK)
- [x] Documentation updated

---

**Phase 4 Result:** ✅ **PASSED & COMPLETE**
