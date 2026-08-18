# UNB Web Application — API Design (Contract)

## Date: 2026-08-16
## Phase: 0 — Discovery & Reference Audit

---

## Base URL

- Development: `http://localhost:3001/api`
- Production: `https://<domain>/api`

## Response Format

All responses follow a consistent structure:

```json
// Success (single item)
{
  "data": { ... }
}

// Success (list)
{
  "data": [ ... ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}

// Error
{
  "error": {
    "message": "Validation failed",
    "details": [ ... ]
  }
}
```

---

## Public Endpoints (No Authentication)

---

### GET /api/products

List published products grouped by category.

| Field | Value |
|-------|-------|
| Authentication | None |
| Query Params | `?category=<slug>&featured=true` |
| Response | `{ data: Product[] }` |
| Errors | 500 |

**Response shape:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Chibuku Super",
      "slug": "chibuku-super",
      "shortDescription": "UNB's flagship carbonated sorghum beer",
      "imageUrl": "https://storage.example.com/...",
      "isFeatured": true,
      "category": {
        "id": "uuid",
        "name": "Sorghum Beverages",
        "slug": "sorghum-beverages"
      }
    }
  ]
}
```

---

### GET /api/products/:slug

Single product with variants.

| Field | Value |
|-------|-------|
| Authentication | None |
| Params | `slug` (string) |
| Response | `{ data: Product & { variants: Variant[] } }` |
| Errors | 404, 500 |

---

### GET /api/news

List published news articles.

| Field | Value |
|-------|-------|
| Authentication | None |
| Query Params | `?category=<string>&page=1&limit=10` |
| Response | `{ data: News[], meta: { total, page, limit } }` |
| Errors | 500 |

---

### GET /api/news/:slug

Single news article.

| Field | Value |
|-------|-------|
| Authentication | None |
| Params | `slug` (string) |
| Response | `{ data: News }` |
| Errors | 404, 500 |

---

### GET /api/jobs

List published jobs.

| Field | Value |
|-------|-------|
| Authentication | None |
| Query Params | `?type=<employment_type>&page=1&limit=10` |
| Response | `{ data: Job[], meta: { total, page, limit } }` |
| Errors | 500 |

Only returns jobs with `status = PUBLISHED` and `closing_date >= today` (or null).

---

### GET /api/jobs/:slug

Single job detail.

| Field | Value |
|-------|-------|
| Authentication | None |
| Params | `slug` (string) |
| Response | `{ data: Job }` |
| Errors | 404, 500 |

---

### POST /api/jobs/:jobId/apply

Submit a job application.

| Field | Value |
|-------|-------|
| Authentication | None |
| Content-Type | `multipart/form-data` |
| Body | `name` (required), `email` (required), `phone`, `coverMessage`, `cv` (file, PDF/DOCX, max 5MB) |
| CAPTCHA | Required in production |
| Response | `{ data: { message: "Application submitted successfully" } }` |
| Errors | 400 (validation), 404 (job not found), 413 (file too large), 500 |

**Validation rules:**
- `name`: required, max 255 chars
- `email`: required, valid email format
- `phone`: optional, max 50 chars
- `coverMessage`: optional, max 2000 chars
- `cv`: optional, PDF/DOCX only, max 5MB

---

### POST /api/contact

Submit a contact enquiry.

| Field | Value |
|-------|-------|
| Authentication | None |
| Content-Type | `application/json` |
| Body | `name` (required), `email` (required), `phone`, `enquiryType` (required), `message` (required) |
| CAPTCHA | Required in production |
| Response | `{ data: { message: "Enquiry submitted successfully" } }` |
| Errors | 400 (validation), 429 (rate limited), 500 |

**Validation rules:**
- `name`: required, max 255 chars
- `email`: required, valid email format
- `phone`: optional, max 50 chars
- `enquiryType`: required, one of ["General", "Trade", "Media", "Other"]
- `message`: required, min 10 chars, max 2000 chars

---

## Authentication Endpoints

---

### POST /api/auth/login

| Field | Value |
|-------|-------|
| Authentication | None |
| Content-Type | `application/json` |
| Body | `email` (required), `password` (required) |
| Response | `{ data: { token: "jwt...", user: { id, name, email, role } } }` |
| Errors | 401 (invalid credentials), 429 (rate limited), 500 |

---

### POST /api/auth/logout

| Field | Value |
|-------|-------|
| Authentication | Required (Bearer token) |
| Response | `{ data: { message: "Logged out" } }` |
| Errors | 401, 500 |

---

### GET /api/auth/me

| Field | Value |
|-------|-------|
| Authentication | Required (Bearer token) |
| Response | `{ data: { id, name, email, role } }` |
| Errors | 401, 500 |

---

## Admin Endpoints (Authentication Required)

All admin endpoints require `Authorization: Bearer <token>` header.

Backend must verify the token and check user role before processing.

---

### Products (Admin)

#### POST /api/admin/products

| Field | Value |
|-------|-------|
| Auth | Required (ADMIN or EDITOR) |
| Content-Type | `multipart/form-data` |
| Body | `name`, `categoryId`, `shortDescription`, `description`, `isFeatured`, `status`, `image` (file) |
| Response | `{ data: Product }` |
| Errors | 400, 401, 500 |

#### PUT /api/admin/products/:id

| Field | Value |
|-------|-------|
| Auth | Required |
| Content-Type | `multipart/form-data` |
| Body | Same as POST (partial update) |
| Response | `{ data: Product }` |
| Errors | 400, 401, 404, 500 |

#### DELETE /api/admin/products/:id

| Field | Value |
|-------|-------|
| Auth | Required (ADMIN) |
| Response | `{ data: { message: "Product deleted" } }` |
| Errors | 401, 403, 404, 500 |

#### PATCH /api/admin/products/:id/status

| Field | Value |
|-------|-------|
| Auth | Required |
| Body | `{ "status": "PUBLISHED" }` or `{ "status": "DRAFT" }` |
| Response | `{ data: Product }` |
| Errors | 400, 401, 404, 500 |

---

### News (Admin)

#### POST /api/admin/news
#### PUT /api/admin/news/:id
#### DELETE /api/admin/news/:id
#### PATCH /api/admin/news/:id/status

Same pattern as Products. Additional field: `publishedAt` (auto-set when status changes to PUBLISHED).

---

### Careers (Admin)

#### POST /api/admin/jobs
#### PUT /api/admin/jobs/:id
#### DELETE /api/admin/jobs/:id
#### PATCH /api/admin/jobs/:id/status

Same pattern as Products. Additional fields: `location`, `employmentType`, `requirements`, `responsibilities`, `closingDate`.

---

### Applications (Admin — Read Only)

#### GET /api/admin/applications

| Field | Value |
|-------|-------|
| Auth | Required |
| Query Params | `?jobId=<uuid>&status=<status>&page=1&limit=20` |
| Response | `{ data: Application[], meta: { total, page, limit } }` |

#### GET /api/admin/applications/:id

| Field | Value |
|-------|-------|
| Auth | Required |
| Response | `{ data: Application & { job: Job } }` |

#### GET /api/admin/applications/:id/cv

| Field | Value |
|-------|-------|
| Auth | Required |
| Response | File download (binary) |
| Notes | Backend fetches from private storage and streams to client |

#### PATCH /api/admin/applications/:id/status

| Field | Value |
|-------|-------|
| Auth | Required |
| Body | `{ "applicationStatus": "REVIEWING" }` |
| Response | `{ data: Application }` |

---

### Enquiries (Admin — Read Only)

#### GET /api/admin/enquiries

| Field | Value |
|-------|-------|
| Auth | Required |
| Query Params | `?enquiryType=<string>&page=1&limit=20` |
| Response | `{ data: Enquiry[], meta: { total, page, limit } }` |

#### GET /api/admin/enquiries/:id

| Field | Value |
|-------|-------|
| Auth | Required |
| Response | `{ data: Enquiry }` |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| POST /api/contact | 5 requests per 15 minutes per IP |
| POST /api/jobs/:id/apply | 3 requests per 15 minutes per IP |
| POST /api/auth/login | 5 attempts per 15 minutes per IP |
| Admin endpoints | 100 requests per minute per user |

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request — validation failed |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found |
| 413 | Payload Too Large — file exceeds limit |
| 429 | Too Many Requests — rate limited |
| 500 | Internal Server Error |
