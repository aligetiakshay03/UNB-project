# UNB Admin CMS — Role & Permission Matrix

**Date:** 2026-08-18  
**Phase:** 5 — Admin CMS  
**Source of Truth:** Express Backend Authorization Middleware (`backend/src/middleware/auth.ts`, `backend/src/routes/admin.routes.ts`)  

---

## 1. Role Definitions

- **UNAUTHENTICATED**: Anonymous visitors / users without valid JWT Bearer credentials.
- **EDITOR**: Authenticated staff with content creation, editing, status toggling (Draft/Publish), candidate reviewing, and enquiry inspection privileges.
- **ADMIN**: Super-administrative users with unrestricted operational control, including permanent content deletion.

---

## 2. Resource Permission Matrix

| Resource | Action | Endpoint | UNAUTHENTICATED | EDITOR | ADMIN |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Admin Access** | Access Admin Portal | `/admin/*` | ❌ (Redirect 401) | ✅ | ✅ |
| **Products** | List all products (Draft & Published) | `GET /api/admin/products` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Products** | Create new product | `POST /api/admin/products` | ❌ (401) | ✅ (201) | ✅ (201) |
| **Products** | Update product details | `PUT /api/admin/products/:id` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Products** | Toggle status (DRAFT / PUBLISHED) | `PATCH /api/admin/products/:id/status` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Products** | Delete product | `DELETE /api/admin/products/:id` | ❌ (401) | ❌ (403 Forbidden) | ✅ (200) |
| **News** | List all news (Draft & Published) | `GET /api/admin/news` | ❌ (401) | ✅ (200) | ✅ (200) |
| **News** | Create news article | `POST /api/admin/news` | ❌ (401) | ✅ (201) | ✅ (201) |
| **News** | Update news article | `PUT /api/admin/news/:id` | ❌ (401) | ✅ (200) | ✅ (200) |
| **News** | Toggle status (DRAFT / PUBLISHED) | `PATCH /api/admin/news/:id/status` | ❌ (401) | ✅ (200) | ✅ (200) |
| **News** | Delete news article | `DELETE /api/admin/news/:id` | ❌ (401) | ❌ (403 Forbidden) | ✅ (200) |
| **Careers** | List all jobs (Draft & Published) | `GET /api/admin/jobs` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Careers** | Create new job vacancy | `POST /api/admin/jobs` | ❌ (401) | ✅ (201) | ✅ (201) |
| **Careers** | Update job vacancy | `PUT /api/admin/jobs/:id` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Careers** | Toggle status (DRAFT / PUBLISHED) | `PATCH /api/admin/jobs/:id/status` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Careers** | Delete job vacancy | `DELETE /api/admin/jobs/:id` | ❌ (401) | ❌ (403 Forbidden) | ✅ (200) |
| **Applications** | List candidate applications | `GET /api/admin/applications` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Applications** | View candidate application details | `GET /api/admin/applications/:id` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Applications** | Inspect / stream CV metadata | `GET /api/admin/applications/:id/cv` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Applications** | Update application status | `PATCH /api/admin/applications/:id/status` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Enquiries** | List contact form submissions | `GET /api/admin/enquiries` | ❌ (401) | ✅ (200) | ✅ (200) |
| **Enquiries** | View enquiry details | `GET /api/admin/enquiries/:id` | ❌ (401) | ✅ (200) | ✅ (200) |

---

## 3. Frontend Role-Aware UI Rules

1. **Delete Action Buttons**: Rendered and accessible exclusively for users with role `ADMIN`. For `EDITOR` users, delete buttons are hidden from the UI to avoid exposing invalid operations.
2. **Backend Enforcement**: If an `EDITOR` attempts to invoke a delete endpoint directly, the backend returns `403 Forbidden`.
3. **401 vs 403 Response Behavior**:
   - `401 Unauthorized`: Session expired or invalid -> Client token cleared -> Redirected to `/admin/login`.
   - `403 Forbidden`: Authenticated user lacks permission -> Session retained -> Error banner displayed.
