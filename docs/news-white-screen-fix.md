# UNB Public News Page — White Screen Bug Fix Report

**Date:** 2026-08-18  
**Component:** Public News Page (`frontend/src/pages/News.tsx`, `frontend/src/pages/NewsDetail.tsx`)  
**Backend:** News Controller (`backend/src/controllers/news.controller.ts`)  
**Status:** ✅ **PASS / RESOLVED**  

---

## 1. Root Cause

1. **Unsafe String Access on Undefined Field:**
   In `frontend/src/pages/News.tsx` (line 118), the summary was calculated as:
   ```tsx
   summary={article.summary || article.content.substring(0, 140) + '...'}
   ```
   However, `GET /api/news` in `backend/src/controllers/news.controller.ts` used a Prisma `select` projection that omitted the `content` field.
   When an article was created without a summary or with an empty string (`article.summary = null` or `""`), `article.summary` evaluated to falsy, and JavaScript attempted to call `article.content.substring(...)` on `undefined`.
   This threw an uncaught runtime exception:
   `TypeError: Cannot read properties of undefined (reading 'substring')`
   which crashed the entire React component tree after data arrival, rendering a blank white screen.

2. **Missing Cursor Pointer Styling:**
   Tailwind CSS v4 base resets default button cursor behavior to `default`. The `<Button>` component and global stylesheet lacked `cursor: pointer` rules, causing button hover to display a standard arrow pointer rather than the hand sign.

---

## 2. Affected Files Changed

1. **`frontend/src/pages/News.tsx`**:
   - Safely extract articles array from API response (`Array.isArray(data) ? data : data?.data || []`).
   - Safely handle optional `summary` and `content` without throwing when either is null/undefined.
   - Protected date formatting against `NaN` dates.
   - Wrapped page in `<ErrorBoundary>`.
2. **`frontend/src/pages/NewsDetail.tsx`**:
   - Safe parsing of article content paragraphs.
   - Wrapped in `<ErrorBoundary>`.
3. **`backend/src/controllers/news.controller.ts`**:
   - Added `content: true` and `createdAt: true` to `getNews` select projection.
4. **`frontend/src/components/ErrorBoundary.tsx`**:
   - Added reusable React ErrorBoundary to prevent any rendering exceptions from crashing the application into a white screen.
5. **`frontend/src/index.css` & `frontend/src/components/ui/Button.tsx`**:
   - Added global `button, [role="button"], select { cursor: pointer; }` and `cursor-pointer` to base button styles.

---

## 3. API Response Shape

`GET /api/news` returns:
```json
{
  "data": [
    {
      "id": "2340c133-9fa2-4cda-b665-7202ba3ef794",
      "title": "Supporting Local Communities",
      "slug": "supporting-local-communities",
      "category": "COMMUNITY",
      "summary": "Creating opportunities and supporting the communities we serve...",
      "content": "Full article content...",
      "featuredImage": "/uploads/image.png",
      "publishedAt": "2026-08-18T10:08:50.000Z",
      "createdAt": "2026-08-18T10:08:50.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

---

## 4. Final Acceptance Verification Matrix

| Test Case | Description | Result |
| :--- | :--- | :---: |
| `/news` Loads | Initial mount and background | ✅ **PASS** |
| No White Screen | Page stays fully rendered after API response arrives | ✅ **PASS** |
| Published Articles Render | All published articles displayed in responsive 3-column grid | ✅ **PASS** |
| Multiple Articles Render | Renders multiple items with unique keys and details | ✅ **PASS** |
| Category Filters | Filter by `ALL`, `COMMUNITY`, `HERITAGE`, `CORPORATE` | ✅ **PASS** |
| Empty State | Filter with 0 matches shows clean "No articles found" box | ✅ **PASS** |
| API Error State | Server error displays localized error card, not blank page | ✅ **PASS** |
| `/news/:slug` Detail | Single article detail page renders with hero and body | ✅ **PASS** |
| Invalid Slug 404 | Non-existent slug shows "Article Not Found" with return button | ✅ **PASS** |
| Admin → Public Publish | Admin creates/publishes article → appears publicly on `/news` | ✅ **PASS** |
| Admin Unpublish | Setting article to `DRAFT` hides it from `/news` | ✅ **PASS** |
| Button Cursor Pointer | Hover on buttons in Admin and Public shows hand cursor | ✅ **PASS** |
| TypeScript & Vite Build | `npm run build` passes with 0 errors | ✅ **PASS** |
