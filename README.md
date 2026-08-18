# UNB Web Application

A full-stack web application for UNB (United National Breweries) built with **React + Vite** (frontend) and **Express + Prisma + PostgreSQL** (backend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7 |
| Backend | Node.js, Express 4, TypeScript, Prisma ORM, Zod, JWT, bcrypt |
| Database | PostgreSQL |
| Package Manager | npm |

---

## Prerequisites

Make sure your system has all of the following installed **before** you start.

| Tool | Minimum Version | Download |
|---|---|---|
| Node.js | v20 LTS or higher | https://nodejs.org |
| npm | v10+ (comes with Node.js) | — |
| Git | Any recent version | https://git-scm.com |
| PostgreSQL | v14 or higher | https://www.postgresql.org/download |

> **Check your versions:**
> ```bash
> node -v
> npm -v
> git --version
> psql --version
> ```

---

## Quick Start (Step by Step)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/vijaydurgasi/UNB.git
cd UNB
```

---

### Step 2 — Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

---

### Step 3 — Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

---

### Step 4 — Set Up Environment Variables

Copy the example env file and fill in your values:

```bash
# From the root UNB folder
copy .env.example backend\.env
```

> On Mac/Linux use `cp .env.example backend/.env`

Now open `backend/.env` in any text editor and update these values:

```env
# PostgreSQL connection string
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/unb_website

# JWT — change this to any long random string (keep it secret!)
JWT_SECRET=replace-this-with-a-long-random-secret-string
JWT_EXPIRES_IN=8h

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email (leave as false for now — not required to run locally)
EMAIL_ENABLED=false

# CAPTCHA (leave as false for now — not required to run locally)
CAPTCHA_ENABLED=false
```

---

### Step 5 — Create the PostgreSQL Database

Open your PostgreSQL client (psql, pgAdmin, or DBeaver) and run:

```sql
CREATE DATABASE unb_website;
```

> Using psql from the command line:
> ```bash
> psql -U postgres -c "CREATE DATABASE unb_website;"
> ```

---

### Step 6 — Generate Prisma Client & Run Migrations

```bash
cd backend

# Generate the Prisma client (must run at least once)
npx prisma generate

# Apply all database migrations (creates all tables)
npm run db:migrate
```

When prompted for a migration name, type something like: `init`

---

### Step 7 — Seed the Database (Optional but Recommended)

This creates a default admin user and sample data:

```bash
# Still inside /backend
npm run db:seed
```

This will create:
- **Admin user** — `admin@unb.co.za` / password: `admin123!`
- Sample product categories
- Sample draft job listing

> ⚠️ **Change the admin password immediately** after first login in production!

---

### Step 8 — Run Both Servers

You need **two terminal windows** open at the same time.

**Terminal 1 — Backend (port 3001):**
```bash
cd UNB/backend
npm run dev
```

You should see:
```
[UNB Backend] Server running on port 3001
[UNB Backend] Health check: http://localhost:3001/api/health
```

**Terminal 2 — Frontend (port 5173):**
```bash
cd UNB/frontend
npm run dev
```

You should see:
```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 9 — Open in Browser

| What | URL |
|---|---|
| 🌐 Website | http://localhost:5173 |
| 🔌 Backend API | http://localhost:3001/api/health |
| 🗄️ Prisma Studio (DB GUI) | Run `npm run db:studio` from `/backend` |

---

## Folder Structure

```
UNB/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── cards/      # JobCard, NewsCard, ProductCard, ValueCard
│   │   │   ├── layout/     # Navbar, Footer, Layout, UtilityBar
│   │   │   ├── sections/   # PageHero, CTABanner, SectionHeader
│   │   │   └── ui/         # Button
│   │   ├── pages/          # All page components (Home, About, Brands, etc.)
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Router and routes
│   │   └── index.css       # Global styles + Tailwind
│   └── package.json
│
├── backend/                # Express REST API
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema (source of truth)
│   │   ├── migrations/     # Auto-generated migration files
│   │   └── seed.ts         # Database seeder
│   ├── src/
│   │   ├── controllers/    # Request handlers (public + admin)
│   │   ├── middleware/     # Auth, rate limiting, file upload
│   │   ├── routes/         # Express route definitions
│   │   ├── validators/     # Zod validation schemas
│   │   ├── lib/            # Prisma client singleton
│   │   └── server.ts       # Express app entry point
│   └── package.json
│
├── docs/                   # Project documentation
│   ├── project-architecture.md
│   ├── api-design.md
│   ├── database-design.md
│   ├── content-model.md
│   ├── implementation-decisions.md
│   └── open-questions.md
│
├── .env.example            # Environment variable template
├── .gitignore
└── README.md
```

---

## Available Commands

### Frontend (`/frontend`)

```bash
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run linter (oxlint)
```

### Backend (`/backend`)

```bash
npm run dev          # Start backend with hot-reload (http://localhost:3001)
npm run build        # Compile TypeScript to /dist
npm run start        # Start compiled production build

npx prisma generate  # Regenerate Prisma Client (run after schema changes)
npm run db:migrate   # Apply new migrations to the database
npm run db:push      # Push schema changes without migration (dev only)
npm run db:seed      # Seed the database with initial data
npm run db:studio    # Open Prisma Studio (visual DB browser)
```

---

## API Endpoints (Summary)

### Public (no auth needed)
```
GET  /api/health
GET  /api/products            ?category=<slug>&featured=true
GET  /api/products/:slug
GET  /api/news                ?category=<str>&page=1&limit=10
GET  /api/news/:slug
GET  /api/jobs                ?type=<str>&page=1&limit=10
GET  /api/jobs/:slug
POST /api/jobs/:jobId/apply   (multipart/form-data — name, email, phone, cv file)
POST /api/contact             (JSON — name, email, enquiryType, message)
```

### Auth
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Admin (JWT required)
```
GET/POST/PUT/PATCH/DELETE  /api/admin/products
GET/POST/PUT/PATCH/DELETE  /api/admin/news
GET/POST/PUT/PATCH/DELETE  /api/admin/jobs
GET/PATCH                  /api/admin/applications
GET                        /api/admin/enquiries
```

---

## Common Issues & Fixes

### `@prisma/client did not initialize yet`
Run `npx prisma generate` inside the `/backend` folder.

### `Cannot connect to database`
- Make sure PostgreSQL is running
- Double-check `DATABASE_URL` in `backend/.env`
- Make sure the database `unb_website` exists

### Port already in use
Change the port in `backend/.env`:
```env
PORT=3002
```
Or kill the existing process using the port.

### `node_modules not found`
You need to install dependencies in **both** folders separately:
```bash
cd frontend && npm install
cd ../backend && npm install
```

---

## Git Workflow (for the team)

```bash
# Get latest changes from GitHub
git pull origin master

# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Make your changes, then stage and commit
git add .
git commit -m "feat: describe what you did"

# Push your branch
git push origin feature/your-feature-name

# Open a Pull Request on GitHub to merge into master
```

---

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for signing JWTs (keep private!) |
| `JWT_EXPIRES_IN` | No | Token lifespan (default: `8h`) |
| `PORT` | No | Backend port (default: `3001`) |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: `http://localhost:5173`) |
| `EMAIL_ENABLED` | No | Enable email notifications (`true`/`false`) |
| `EMAIL_API_KEY` | No | Email provider API key |
| `EMAIL_FROM` | No | Sender email address |
| `EMAIL_CONTACT_TO` | No | Where contact enquiries are sent |
| `EMAIL_CAREERS_TO` | No | Where job applications are sent |
| `CAPTCHA_ENABLED` | No | Enable CAPTCHA on forms (`true`/`false`) |
| `CAPTCHA_SECRET_KEY` | No | CAPTCHA provider secret |
| `STORAGE_PROVIDER` | No | File storage provider (`local`, `s3`, etc.) |

---

## Contributing

1. Clone the repo
2. Follow the Quick Start above
3. Create a feature branch (`git checkout -b feature/your-feature`)
4. Make your changes
5. Push and open a Pull Request

---

*Built with ❤️ for UNB — United National Breweries*
