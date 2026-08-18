# UNB Web Application — Database Design

## Date: 2026-08-16
## Phase: 0 — Discovery & Reference Audit
## ORM: Prisma (exclusively)

---

## 1. Design Principles

- PostgreSQL as the sole database
- Prisma ORM for all database operations — no raw SQL or node-postgres
- Every content table has `id`, `created_at`, `updated_at`
- Publication timestamps (`published_at`) separate from record creation
- Slugs for SEO-friendly URLs
- Status fields for draft/publish workflow
- File metadata stored in PostgreSQL; actual files in object storage
- Application status tracking for internal admin workflow

---

## 2. Schema Overview

```
users
categories
products
product_variants
news
jobs
applications
enquiries
```

---

## 3. Table Definitions

### users

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, default uuid | |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL, UNIQUE | |
| password_hash | TEXT | NOT NULL | bcrypt hashed |
| role | ENUM('ADMIN','EDITOR') | NOT NULL, default 'EDITOR' | Exact roles subject to client confirmation |
| created_at | TIMESTAMP | NOT NULL, default now() | |
| updated_at | TIMESTAMP | NOT NULL, auto-update | |

---

### categories

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| name | VARCHAR(255) | NOT NULL | e.g., "Sorghum Beverages" |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | e.g., "sorghum-beverages" |
| description | TEXT | NULLABLE | |
| display_order | INT | NOT NULL, default 0 | Controls rendering order |
| created_at | TIMESTAMP | NOT NULL, default now() | |
| updated_at | TIMESTAMP | NOT NULL, auto-update | |

---

### products

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| category_id | UUID | FK → categories.id | |
| name | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | |
| short_description | VARCHAR(500) | NULLABLE | Card summary text |
| description | TEXT | NULLABLE | Full detail page content |
| image_url | TEXT | NULLABLE | URL to object storage |
| is_featured | BOOLEAN | NOT NULL, default false | Show on Home page |
| status | ENUM('DRAFT','PUBLISHED') | NOT NULL, default 'DRAFT' | |
| display_order | INT | NOT NULL, default 0 | |
| created_at | TIMESTAMP | NOT NULL, default now() | |
| updated_at | TIMESTAMP | NOT NULL, auto-update | |

**Indexes**: `slug` (unique), `status`, `category_id`, `is_featured`

---

### product_variants

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| product_id | UUID | FK → products.id, CASCADE | |
| name | VARCHAR(255) | NOT NULL | e.g., "Banana", "Cream" |
| description | TEXT | NULLABLE | |
| image_url | TEXT | NULLABLE | |
| display_order | INT | NOT NULL, default 0 | |
| created_at | TIMESTAMP | NOT NULL, default now() | |
| updated_at | TIMESTAMP | NOT NULL, auto-update | |

**Indexes**: `product_id`

---

### news

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| title | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | |
| category | VARCHAR(100) | NULLABLE | e.g., "Community", "Corporate" |
| summary | VARCHAR(500) | NULLABLE | Listing preview text |
| content | TEXT | NOT NULL | Full article body |
| featured_image | TEXT | NULLABLE | URL to object storage |
| status | ENUM('DRAFT','PUBLISHED') | NOT NULL, default 'DRAFT' | |
| published_at | TIMESTAMP | NULLABLE | When made public (separate from created_at) |
| created_at | TIMESTAMP | NOT NULL, default now() | |
| updated_at | TIMESTAMP | NOT NULL, auto-update | |

**Indexes**: `slug` (unique), `status`, `published_at`, `category`

---

### jobs

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| title | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | |
| location | VARCHAR(255) | NULLABLE | e.g., "Pretoria, South Africa" |
| employment_type | VARCHAR(100) | NULLABLE | e.g., "Full-time", "Contract" |
| description | TEXT | NOT NULL | |
| requirements | TEXT | NULLABLE | |
| responsibilities | TEXT | NULLABLE | |
| closing_date | DATE | NULLABLE | |
| status | ENUM('DRAFT','PUBLISHED') | NOT NULL, default 'DRAFT' | |
| created_at | TIMESTAMP | NOT NULL, default now() | |
| updated_at | TIMESTAMP | NOT NULL, auto-update | |

**Indexes**: `slug` (unique), `status`, `closing_date`

---

### applications

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| job_id | UUID | FK → jobs.id | |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL | |
| phone | VARCHAR(50) | NULLABLE | |
| cover_message | TEXT | NULLABLE | |
| cv_url | TEXT | NULLABLE | Private object storage URL |
| cv_file_name | VARCHAR(255) | NULLABLE | Original filename |
| cv_file_size | INT | NULLABLE | Bytes |
| cv_file_type | VARCHAR(100) | NULLABLE | MIME type |
| application_status | ENUM('NEW','REVIEWING','SHORTLISTED','REJECTED','HIRED') | NOT NULL, default 'NEW' | Internal admin only |
| created_at | TIMESTAMP | NOT NULL, default now() | |

**Indexes**: `job_id`, `application_status`, `created_at`

> [!NOTE]
> `application_status` is an internal admin feature. It is NOT exposed on the public website.

---

### enquiries

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL | |
| phone | VARCHAR(50) | NULLABLE | |
| enquiry_type | VARCHAR(100) | NOT NULL | e.g., "General", "Trade", "Media" |
| message | TEXT | NOT NULL | |
| created_at | TIMESTAMP | NOT NULL, default now() | |

**Indexes**: `enquiry_type`, `created_at`

---

## 4. Relationships

```
categories  1 ──── * products
products    1 ──── * product_variants
jobs        1 ──── * applications
users       1 ──── * (creates/manages products, news, jobs)
```

---

## 5. Prisma Schema Preview

```prisma
enum Role {
  ADMIN
  EDITOR
}

enum ContentStatus {
  DRAFT
  PUBLISHED
}

enum ApplicationStatus {
  NEW
  REVIEWING
  SHORTLISTED
  REJECTED
  HIRED
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String   @map("password_hash")
  role         Role     @default(EDITOR)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Category {
  id           String    @id @default(uuid())
  name         String
  slug         String    @unique
  description  String?
  displayOrder Int       @default(0) @map("display_order")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  products     Product[]

  @@map("categories")
}

model Product {
  id               String           @id @default(uuid())
  categoryId       String           @map("category_id")
  name             String
  slug             String           @unique
  shortDescription String?          @map("short_description")
  description      String?
  imageUrl         String?          @map("image_url")
  isFeatured       Boolean          @default(false) @map("is_featured")
  status           ContentStatus    @default(DRAFT)
  displayOrder     Int              @default(0) @map("display_order")
  createdAt        DateTime         @default(now()) @map("created_at")
  updatedAt        DateTime         @updatedAt @map("updated_at")
  category         Category         @relation(fields: [categoryId], references: [id])
  variants         ProductVariant[]

  @@index([status])
  @@index([categoryId])
  @@index([isFeatured])
  @@map("products")
}

model ProductVariant {
  id           String   @id @default(uuid())
  productId    String   @map("product_id")
  name         String
  description  String?
  imageUrl     String?  @map("image_url")
  displayOrder Int      @default(0) @map("display_order")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  product      Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@map("product_variants")
}

model News {
  id            String        @id @default(uuid())
  title         String
  slug          String        @unique
  category      String?
  summary       String?
  content       String
  featuredImage String?       @map("featured_image")
  status        ContentStatus @default(DRAFT)
  publishedAt   DateTime?     @map("published_at")
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  @@index([status])
  @@index([publishedAt])
  @@index([category])
  @@map("news")
}

model Job {
  id               String        @id @default(uuid())
  title            String
  slug             String        @unique
  location         String?
  employmentType   String?       @map("employment_type")
  description      String
  requirements     String?
  responsibilities String?
  closingDate      DateTime?     @map("closing_date") @db.Date
  status           ContentStatus @default(DRAFT)
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")
  applications     Application[]

  @@index([status])
  @@index([closingDate])
  @@map("jobs")
}

model Application {
  id                String            @id @default(uuid())
  jobId             String            @map("job_id")
  name              String
  email             String
  phone             String?
  coverMessage      String?           @map("cover_message")
  cvUrl             String?           @map("cv_url")
  cvFileName        String?           @map("cv_file_name")
  cvFileSize        Int?              @map("cv_file_size")
  cvFileType        String?           @map("cv_file_type")
  applicationStatus ApplicationStatus @default(NEW) @map("application_status")
  createdAt         DateTime          @default(now()) @map("created_at")
  job               Job               @relation(fields: [jobId], references: [id])

  @@index([jobId])
  @@index([applicationStatus])
  @@index([createdAt])
  @@map("applications")
}

model Enquiry {
  id          String   @id @default(uuid())
  name        String
  email       String
  phone       String?
  enquiryType String   @map("enquiry_type")
  message     String
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([enquiryType])
  @@index([createdAt])
  @@map("enquiries")
}
```

---

## 6. Migration Strategy

- Use `prisma migrate dev` during development
- Use `prisma migrate deploy` for staging/production
- Seed script for initial categories, sample products, and admin user
- Never store seed passwords in source control — use environment variables
