# UNB Web Application — User Acceptance Testing (UAT) Checklist

**Date:** 2026-08-19  
**Status:** **READY FOR CLIENT UAT ✅**

---

## 1. Public Website Testing Checklist

### 🏠 Home Page (`/`)
- [ ] Top utility contact bar renders (phone, email, hours).
- [ ] Primary navigation bar renders with high-contrast active states.
- [ ] Page hero banner renders crisp HD imagery with headline & CTA buttons.
- [ ] About UNB teaser section renders with heritage narrative and stats.
- [ ] Featured Brands carousel/grid displays Chibuku, Ijuba, Leopard, and Ukhozi Mageu.
- [ ] Sustainability pillar preview renders.
- [ ] Careers teaser links to open opportunities.
- [ ] Latest News cards render published articles.
- [ ] Global CTA banner & Footer render complete corporate information, social links, and legal disclaimer.

### ℹ️ About Us (`/about`)
- [ ] Hero banner renders with heritage title.
- [ ] Company Overview / Our Story narrative renders.
- [ ] Vision & Mission statements render.
- [ ] Core Corporate Values grid renders with iconography.
- [ ] Brewing Heritage timeline renders.
- [ ] Community Partnerships and Corporate Principles render.

### 🌿 Sustainability (`/sustainability`)
- [ ] Hero banner renders.
- [ ] Environmental stewardship narrative renders.
- [ ] Client placeholder tag clearly indicated for custom ESG statistics.

### 🍺 Brands & Products (`/brands` & `/brands/:slug`)
- [ ] Brands portfolio page renders all published beverage categories.
- [ ] Sorghum Beer category displays Chibuku, Ijuba, etc.
- [ ] Speciality Beers & Non-Alcoholic Mageu categories display correctly.
- [ ] Clicking "DISCOVER MORE" navigates to product detail (`/brands/:slug`).
- [ ] Product detail page displays packaging sizes, ABV, tasting notes, and brewing specs.
- [ ] "BACK TO BRANDS PORTFOLIO" link returns cleanly.

### 💼 Careers & Vacancies (`/careers` & `/careers/:slug`)
- [ ] Careers listing displays active open vacancies.
- [ ] Filtering by Employment Type (All, Full-Time, Contract, Internship) functions smoothly.
- [ ] Clicking a job card opens the dedicated vacancy detail page (`/careers/:slug`).
- [ ] Vacancy page details requirements, responsibilities, location, and closing date.
- [ ] Clicking "APPLY FOR THIS POSITION" opens the candidate application modal.
- [ ] Candidate application modal accepts Full Name, Email, Phone, Cover Note, and CV upload (.pdf, .docx, max 5MB).
- [ ] Successful submission displays green confirmation message.

### 📰 News & Press (`/news` & `/news/:slug`)
- [ ] News listing displays all published press releases and community articles.
- [ ] Category filter tabs (All, Community, Heritage, Corporate) filter articles seamlessly.
- [ ] Clicking "READ MORE" opens the individual article view (`/news/:slug`).
- [ ] Article displays featured image showcase, publication date, category badge, and formatted body paragraphs.
- [ ] "BACK TO NEWS & MEDIA" link returns cleanly.

### ✉️ Contact Us (`/contact`)
- [ ] Head Office contact info, phone, email, and physical brewery address render.
- [ ] Interactive enquiry form validates required fields (Name, Email, Enquiry Type, Message).
- [ ] Successful submission persists enquiry and displays green confirmation card.
- [ ] Re-submission rate limiting functions safely.

---

## 2. Admin CMS Portal Checklist

### 🔐 Authentication & Session
- [ ] Direct access to `/admin` redirects unauthenticated users to `/admin/login`.
- [ ] Admin login (`admin@unb.co.za` / `admin123!`) succeeds and navigates to Dashboard.
- [ ] Editor login (`editor@unb.co.za` / `editor123!`) succeeds with Editor role permissions.
- [ ] Browser refresh maintains active admin session.
- [ ] Clicking "Sign Out" destroys cookie session; subsequent API calls return 401.

### 📊 Admin CMS Modules
- [ ] **Products Module (`/admin/products`):**
  - [ ] List all products with category, featured status, and Draft/Published badges.
  - [ ] Create new product with image upload and status selector.
  - [ ] Edit existing product and toggle Publish/Draft.
  - [ ] Delete product (Admin only; Editor is blocked).
- [ ] **News Module (`/admin/news`):**
  - [ ] List all news articles with category, publish date, and status.
  - [ ] Create new article with image and rich text content.
  - [ ] Edit article and update publication status.
  - [ ] Delete article (Admin only).
- [ ] **Careers Module (`/admin/careers`):**
  - [ ] List all career vacancies with location and status.
  - [ ] Create, edit, publish, and delete job postings.
- [ ] **Applications Module (`/admin/applications`):**
  - [ ] View submitted candidate job applications.
  - [ ] Filter applications by Job Vacancy.
  - [ ] Update candidate status (New, Reviewed, Shortlisted, Interviewed, Rejected, Hired).
  - [ ] Securely download/stream candidate CV resume.
- [ ] **Enquiries Module (`/admin/enquiries`):**
  - [ ] View visitor contact submissions with name, email, phone, category, and message text.

---

## 3. Technical & Environmental Checklist
- [ ] **Desktop (1440px):** Pixel-accurate alignment, zero visual regressions.
- [ ] **Tablet (768px):** Responsive 2-column grids and clean touch targets.
- [ ] **Mobile (375px):** Responsive 1-column layouts, mobile navigation drawer, zero horizontal overflow.
- [ ] **Security:** HttpOnly cookies, CSRF defenses, private CV isolation, rate limiters.
- [ ] **SEO:** Unique document titles, meta descriptions, single H1s, Open Graph cards.
- [ ] **Performance:** Eager hero banner loading, lazy-loaded cards, non-blocking asynchronous email dispatch.
