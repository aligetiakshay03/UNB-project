# UNB Web Application — UAT Issue Log

**Date:** 2026-08-19  
**Phase:** **PHASE 8 — FULL QA & UAT PREPARATION**

---

## 1. QA & Regression Defect Log

| ID | Area | Page | Severity | Description | Steps to Reproduce | Expected Result | Actual Result | Status | Notes |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **BUG-01** | Backend API | `/api/products/:slug` | **High** | Querying `/api/products/:slug` with non-unique compound where `{ slug, status }` caused 500 error in Prisma `findUnique`. | Query `GET /api/products/chibuku`. | Returns product object with HTTP 200. | Threw Prisma exception due to missing compound unique index. | **FIXED** | Changed to `prisma.product.findFirst({ where: { slug, status: 'PUBLISHED' } })`. Verified in `verify-phase8.ts`. |
| **BUG-02** | Backend API | `/api/news/:slug` | **High** | Querying `/api/news/:slug` with non-unique compound where `{ slug, status }` caused 500 error in Prisma `findUnique`. | Query `GET /api/news/:slug`. | Returns news article object with HTTP 200. | Threw Prisma exception due to missing compound unique index. | **FIXED** | Changed to `prisma.news.findFirst({ where: { slug, status: 'PUBLISHED' } })`. Verified in `verify-phase8.ts`. |
| **BUG-03** | Validation | `/api/contact` | **Medium** | Frontend dropdown sent `Trade & Distribution`, `Media & Press`, `General Enquiry` which were rejected by narrow backend enum validator. | Submit contact form selecting "Trade & Distribution". | Enquiry accepted with HTTP 201. | Returned 400 Bad Request enum validation error. | **FIXED** | Updated `contactSchema` to accept full readable labels (`min(1).max(100)`). Verified in `verify-phase8.ts`. |
| **BUG-04** | Security | Headers | **Low** | Missing explicit Clickjacking frameguard and Referrer-Policy on API responses. | Inspect response headers on `/api/health`. | Frame protection and strict referrer policy set. | Default fallback header missing strict options. | **FIXED** | Configured Helmet `frameguard: { action: 'deny' }` and `referrerPolicy: { policy: 'strict-origin-when-cross-origin' }`. |

---

## 2. Outstanding Severity Summary

* **Critical Severity Issues:** **0**
* **High Severity Issues:** **0**
* **Medium Severity Issues:** **0**
* **Low Severity Issues:** **0**
* **Total Open Defects:** **0**
