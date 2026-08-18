# UNB Web Application — Authentication & Session Architecture

**Date:** 2026-08-18  
**Phase:** 4 Verification Gate  
**Scope:** Admin Portal Authentication (`/admin/login`, `/api/auth/*`, `/api/admin/*`)  

---

## 1. Authentication Specifications

| Parameter | Specification / Implementation |
| :--- | :--- |
| **Token / Session Type** | Stateless JSON Web Token (JWT), signed with HMAC SHA-256 using `JWT_SECRET`. |
| **Client Storage Location** | `localStorage.getItem('unb_auth_token')` |
| **Token Lifetime** | 8 Hours (default configured via `process.env.JWT_EXPIRES_IN || '8h'`). |
| **State Restoration** | On mount, frontend queries `GET /api/auth/me` with Bearer token to restore active session identity. |
| **Token Expiry Handling** | `apiClient.ts` intercepts HTTP `401 Unauthorized` responses and automatically removes `unb_auth_token` from `localStorage`, immediately clearing unauthenticated state. |
| **Logout Behavior** | `POST /api/auth/logout` endpoint is notified, and `localStorage.removeItem('unb_auth_token')` is executed client-side. Logout is stateless (client discards token). |
| **`/api/auth/me` Usage** | Decodes verified JWT from `Authorization: Bearer <token>` header, queries `users` table, and returns `{ id, name, email, role }`. |

---

## 2. Security Evaluation & Production Hardening Roadmap

### Current Development State
- **Storage**: Client-side `localStorage`.
- **Transmission**: HTTP Authorization header (`Bearer <token>`).
- **Suitability**: Appropriate for development and staging verification.

### Production Recommendations
- **HttpOnly Secure Cookies**: Transition JWT delivery to `httpOnly; Secure; SameSite=Strict` cookies to mitigate XSS exposure risks prior to public production deployment.
- **Token Invalidation / Revocation**: If instant server-side revocation is needed before natural 8h expiration, introduce a Redis blocklist or token generation version column in `users` table.
