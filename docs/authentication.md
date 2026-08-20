# UNB Web Application — Authentication & Session Architecture

**Date:** 2026-08-19  
**Status:** **PHASE 6 AUTHENTICATION HARDENING COMPLETE**  
**Scope:** Admin Portal Authentication (`/admin/login`, `/api/auth/*`, `/api/admin/*`)  

---

## 1. Authentication Specifications

| Parameter | Specification / Implementation |
| :--- | :--- |
| **Session Model** | Hybrid Hardened Cookie & Token Authentication: <br>1. Primary Production: `httpOnly; SameSite=Lax; Secure` cookie named `admin_token`<br>2. Backward-Compatible Header: `Authorization: Bearer <token>` |
| **Cookie Properties** | `httpOnly: true`, `SameSite: 'lax'`, `Secure: process.env.NODE_ENV === 'production'`, `maxAge: 8 hours`, `path: '/'` |
| **Token Lifetime** | 8 Hours (`JWT_EXPIRES_IN="8h"`). |
| **State Restoration** | On mount, frontend queries `GET /api/auth/me` with `credentials: 'include'`. The backend inspects the `admin_token` cookie or Bearer header to verify the active user. |
| **Token Expiry Handling** | `apiClient.ts` intercepts HTTP `401 Unauthorized` responses, clearing any cached client storage and resetting auth context. |
| **Logout Semantics** | `POST /api/auth/logout` explicitly executes `res.clearCookie('admin_token')` with matching domain/path options and clears client-side memory. Subsequent requests return `401 Unauthorized`. |
| **`/api/auth/me` Endpoint** | Verifies cookie or header JWT, looks up current user record in PostgreSQL, and returns `{ id, name, email, role }`. |

---

## 2. Security & CSRF Protection Strategy

1. **XSS Mitigation:**
   By storing the JWT in an `httpOnly` cookie (`admin_token`), JavaScript in the browser cannot read or exfiltrate the token during an XSS vulnerability.
2. **CORS & Credentials:**
   The backend Express server configures explicit CORS with the configured `FRONTEND_URL` (`http://localhost:5173`) and `credentials: true`. `Access-Control-Allow-Origin: *` is strictly avoided.
3. **CSRF Defense for State-Changing Operations:**
   - **SameSite Cookie Policy:** `SameSite=Lax` blocks cookies from being attached to cross-site subrequests.
   - **Origin / Referer Validation:** Mutating methods (`POST`, `PUT`, `PATCH`, `DELETE`) authenticated via cookies verify that the incoming `Origin` or `Referer` matches the authorized frontend domain.
4. **Environment Secret Enforcement:**
   In `production` mode, `validateEnv()` enforces that `JWT_SECRET` must be a high-entropy string at least 32 characters in length.
