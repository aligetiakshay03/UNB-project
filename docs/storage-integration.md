# UNB Web Application — Private Object & Media Storage Architecture

**Date:** 2026-08-19  
**Status:** **PHASE 6A COMPLETE (Architecture & Providers Integrated) / PHASE 6B PENDING CLIENT CREDENTIALS**

---

## 1. Storage Privacy Boundaries

The UNB application separates file assets into two distinct tiers:

### Tier 1: Public Media Assets (Images)
* **Usage:** CMS-managed product images, news article banners.
* **Storage Location:** `backend/uploads/` on disk (or public cloud bucket).
* **Serving:** Served statically via Express (`/uploads/...`) with CORS and Helmet policies.
* **URL Format:** `http://localhost:5000/uploads/<filename>` (resolved by `resolveImageUrl`).

### Tier 2: Private Sensitive Documents (Candidate CVs)
* **Usage:** Candidate CV resumes (.pdf, .docx).
* **Storage Location:** `backend/storage/private/cv/...` (or private S3/Supabase bucket).
* **Privacy Enforced:** Completely isolated from public `/uploads/` static paths. Probing `/uploads/cv/...` returns `404 Not Found`.
* **Access Control:** Accessible **ONLY** via authenticated Admin API:
  `GET /api/admin/applications/:id/cv` (requires `authenticate` and `applications.view` permission).
* **Delivery:** Directly streamed via Node readable stream with safe `Content-Disposition: inline/attachment` headers or generated short-lived signed URLs.

---

## 2. Architecture & Provider Drivers

The storage subsystem is located under `backend/src/services/storage/`:
- **`storage.types.ts`**: Standardized file upload, streaming, and signed-URL interface.
- **`storage.service.ts`**: Provider factory.
- **`providers/local-private.provider.ts`**: Local private filesystem driver creating sanitized directories under `backend/storage/private/`.
- **`providers/s3.provider.ts`**: AWS S3 driver for private buckets and signed URLs.
- **`providers/supabase.provider.ts`**: Supabase Storage driver for private bucket storage and signed download URLs.

---

## 3. Transaction & Rollback Flow

For candidate job applications:
1. **Upload First:** The CV binary buffer is validated (PDF/DOCX, max 5 MB) and uploaded to private storage under `cv/{sanitized-name}`.
2. **Database Record:** If upload succeeds, the application record is created in PostgreSQL with `cvUrl` (storing `storageKey`), `cvFileName`, `cvFileSize`, `cvFileType`.
3. **Rollback on Error:**
   - If storage upload fails: the request immediately aborts with `500 Internal Server Error`; no orphaned database record is created.
   - If database insertion throws: the uploaded storage key is automatically deleted from disk/bucket to prevent orphaned files.

---

## 4. Configuration (`.env`)

```env
# Options: local-private | s3 | supabase
STORAGE_PROVIDER="local-private"

# Cloud Storage Settings (Required if STORAGE_PROVIDER=s3 or supabase)
STORAGE_BUCKET="unb-private-storage"
STORAGE_REGION="af-south-1"
STORAGE_ACCESS_KEY="your-access-key"
STORAGE_SECRET_KEY="your-secret-key"
STORAGE_ENDPOINT="https://<project-ref>.supabase.co/storage/v1/s3"
```

---

## 5. Current Status Matrix

| Storage Tier / Feature | Status | Details |
| :--- | :---: | :--- |
| Public Image Serving | ✅ Active | Express `/uploads/` with Helmet cross-origin policy |
| Private CV Local Storage | ✅ Active | Private folder `backend/storage/private/cv/` |
| Secure CV Streaming Endpoint | ✅ Active | `GET /api/admin/applications/:id/cv` (Auth & RBAC required) |
| S3 Storage Adapter | ✅ Implemented | Ready for AWS S3 credentials |
| Supabase Storage Adapter | ✅ Implemented | Ready for Supabase bucket credentials |
| Live Cloud Bucket Credentials | ⏳ Pending Client | S3 or Supabase Storage credentials to be provided by UNB |
