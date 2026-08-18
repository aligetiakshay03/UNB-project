# UNB Web Application — Project Architecture

## Date: 2026-08-16
## Phase: 0 — Discovery & Reference Audit

---

## 1. Repository Structure

Monorepo with two applications sharing a single repository:

```
unb-website/
│
├── frontend/                    # React + TypeScript + Vite
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── UtilityBar.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Layout.tsx          # Public page shell
│   │   │   │   └── AdminLayout.tsx     # Admin page shell
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── FormInput.tsx
│   │   │   │   ├── FormTextarea.tsx
│   │   │   │   ├── FormSelect.tsx
│   │   │   │   ├── FileUpload.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   └── SuccessMessage.tsx
│   │   │   ├── sections/
│   │   │   │   ├── PageHero.tsx
│   │   │   │   ├── SectionHeader.tsx
│   │   │   │   ├── CTABanner.tsx
│   │   │   │   └── FeatureBlock.tsx
│   │   │   └── cards/
│   │   │       ├── ProductCard.tsx
│   │   │       ├── ProductVariantCard.tsx
│   │   │       ├── NewsCard.tsx
│   │   │       ├── JobCard.tsx
│   │   │       └── ValueCard.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Sustainability.tsx
│   │   │   ├── Brands.tsx
│   │   │   ├── BrandDetail.tsx
│   │   │   ├── Careers.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── News.tsx
│   │   │   ├── NewsDetail.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ProductList.tsx
│   │   │       ├── ProductForm.tsx
│   │   │       ├── NewsList.tsx
│   │   │       ├── NewsForm.tsx
│   │   │       ├── CareerList.tsx
│   │   │       ├── CareerForm.tsx
│   │   │       ├── ApplicationList.tsx
│   │   │       ├── ApplicationDetail.tsx
│   │   │       ├── EnquiryList.tsx
│   │   │       └── EnquiryDetail.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts               # Axios/fetch base client
│   │   │   ├── productService.ts
│   │   │   ├── newsService.ts
│   │   │   ├── careersService.ts
│   │   │   ├── contactService.ts
│   │   │   └── authService.ts
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Admin auth state
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useFetch.ts
│   │   │
│   │   ├── types/
│   │   │   ├── product.ts
│   │   │   ├── news.ts
│   │   │   ├── job.ts
│   │   │   ├── application.ts
│   │   │   ├── enquiry.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.ts
│   │   │   └── formatters.ts
│   │   │
│   │   ├── assets/
│   │   │   └── images/
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── productController.ts
│   │   │   ├── newsController.ts
│   │   │   ├── careerController.ts
│   │   │   ├── applicationController.ts
│   │   │   ├── contactController.ts
│   │   │   └── authController.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── productRoutes.ts
│   │   │   ├── newsRoutes.ts
│   │   │   ├── careerRoutes.ts
│   │   │   ├── applicationRoutes.ts
│   │   │   ├── contactRoutes.ts
│   │   │   ├── authRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── validationMiddleware.ts
│   │   │   ├── uploadMiddleware.ts
│   │   │   ├── captchaMiddleware.ts
│   │   │   ├── rateLimitMiddleware.ts
│   │   │   └── errorMiddleware.ts
│   │   │
│   │   ├── services/
│   │   │   ├── emailService.ts
│   │   │   ├── storageService.ts
│   │   │   └── captchaService.ts
│   │   │
│   │   ├── validators/
│   │   │   ├── productValidator.ts
│   │   │   ├── newsValidator.ts
│   │   │   ├── jobValidator.ts
│   │   │   ├── applicationValidator.ts
│   │   │   └── contactValidator.ts
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   │
│   │   └── app.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── reference-audit.md
│   ├── project-architecture.md
│   ├── database-design.md
│   ├── api-design.md
│   ├── content-model.md
│   ├── implementation-decisions.md
│   └── open-questions.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 2. Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | React 18 + TypeScript | Client requirement |
| Build tool | Vite | Client requirement |
| Routing | React Router v6 | Standard for React SPAs |
| Backend | Node.js + Express | Client requirement |
| ORM | Prisma | Mandatory — no mixing with raw SQL |
| Database | PostgreSQL | Client requirement |
| Auth | JWT (access + refresh tokens) | Standard for REST APIs |
| Password hashing | bcrypt | Industry standard |
| Form validation (FE) | Custom + HTML5 native | Minimal dependencies |
| API validation (BE) | Zod or express-validator | Type-safe validation |
| File uploads | multer (middleware) → object storage | Standard Express upload handling |
| Email | Configurable (Nodemailer adapter) | Provider TBD |
| CAPTCHA | Configurable (mock dev / real prod) | Provider TBD |
| CSS | Tailwind CSS | Client scope mentions it as option |
| Icons | Lucide React | Lightweight, tree-shakeable |

---

## 3. Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/unb_website

# JWT
JWT_SECRET=<random-secret>
JWT_EXPIRES_IN=24h

# Email (provider TBD)
EMAIL_ENABLED=false
EMAIL_API_KEY=
EMAIL_FROM=noreply@unb.co.za
EMAIL_CONTACT_TO=info@unb.co.za

# CAPTCHA (provider TBD)
CAPTCHA_ENABLED=false
CAPTCHA_SECRET_KEY=
CAPTCHA_SITE_KEY=

# File Storage (provider TBD)
STORAGE_PROVIDER=local
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_REGION=
STORAGE_PUBLIC_URL=

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

> [!CAUTION]
> Never commit `.env` files to Git. Only `.env.example` with placeholder values.

---

## 4. Communication Architecture

```
Browser
   │
   │  HTTP
   v
Frontend (Vite dev server :5173)
   │
   │  REST API calls
   v
Backend (Express :3001)
   │
   ├──── Prisma ──── PostgreSQL
   │
   ├──── Storage Service ──── Object Storage
   │
   └──── Email Service ──── Email Provider
```

### CORS Configuration

- Development: Allow `http://localhost:5173`
- Production: Allow only the deployed frontend domain

### API Base Path

All API routes prefixed with `/api/`:
- Public: `/api/products`, `/api/news`, `/api/jobs`, `/api/contact`
- Admin: `/api/admin/products`, `/api/admin/news`, etc.
- Auth: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`

---

## 5. Build & Dev Scripts

### Frontend

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

### Backend

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "db:migrate": "prisma migrate dev",
  "db:seed": "tsx prisma/seed.ts",
  "db:studio": "prisma studio"
}
```

---

## 6. Git Strategy

```
main          ← production-ready code
develop       ← integration branch
feature/*     ← individual feature branches
```

### Branch naming:
- `feature/phase-1-design-system`
- `feature/phase-2-home-page`
- `feature/phase-3-backend`
- etc.

### .gitignore essentials:
```
node_modules/
dist/
.env
*.log
uploads/
```
