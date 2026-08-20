# 🐳 United National Breweries (UNB) — One-Command Docker Setup

This project is fully Dockerized so anyone can run the complete web application, backend API, and PostgreSQL database with a single command — **no Node.js, npm, or database installation required!**

---

## ⚡ Quick Start (1 Command)

Make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running, then open your terminal in this repository folder and run:

```bash
docker compose up --build
```

*(Or `docker-compose up --build` on older Docker versions)*

That's it! Docker will automatically:
1. Spin up a dedicated **PostgreSQL 16** database container.
2. Initialize database tables and seed default **Admin**, **Editor**, and **Products** data.
3. Start the **Backend API** container on `http://localhost:5000`.
4. Compile and serve the **Frontend Website** container on `http://localhost:5173` (and `http://localhost:3000`).

---

## 🌐 URLs & Access

| Resource | URL | Description |
| :--- | :--- | :--- |
| **Public Website** | [http://localhost:5173](http://localhost:5173) | Main website (Home, About, Brands, Careers, News, Contact, Sustainability) |
| **Alternative Frontend** | [http://localhost:3000](http://localhost:3000) | Secondary port mapping for convenience |
| **Admin CMS Portal** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | Protected content management system |
| **Backend Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | API status & uptime |

---

## 🔑 Default Credentials

### 1. Administrator Account (Full Permissions)
* **Email:** `admin@unb.co.za`
* **Password:** `admin123!`
* **Role:** `ADMIN` (Can create, edit, publish, unpublish, and delete products, news, jobs, and view candidate CVs).

### 2. Editor Account (Content Permissions)
* **Email:** `editor@unb.co.za`
* **Password:** `editor123!`
* **Role:** `EDITOR` (Can create, edit, publish, and unpublish content; deletion is restricted to Admins).

---

## 🛠️ Useful Docker Commands

### Stop the Application
Press `Ctrl + C` in your terminal, or run:
```bash
docker compose down
```

### Stop and Reset Database (Clean Slate)
```bash
docker compose down -v
docker compose up --build
```

### Run in Background (Detached Mode)
```bash
docker compose up -d --build
```

### View Live Logs
```bash
docker compose logs -f
```

---

## 📂 Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      DOCKER NETWORK                         │
│                                                             │
│   ┌──────────────────┐           ┌──────────────────────┐   │
│   │   unb-frontend   │           │     unb-backend      │   │
│   │  (Nginx / Vite)  │──────────>│   (Express / Node)   │   │
│   │   Port: 5173     │   /api/   │      Port: 5000      │   │
│   └──────────────────┘           └──────────┬───────────┘   │
│                                             │               │
│                                             │ DATABASE_URL  │
│                                             ▼               │
│                                  ┌──────────────────────┐   │
│                                  │        unb-db        │   │
│                                  │   (PostgreSQL 16)    │   │
│                                  │      Port: 5432      │   │
│                                  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
