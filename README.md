# Store Rating Platform — Full Stack Intern Coding Challenge

A complete implementation of the supplied challenge using **React + Express.js + PostgreSQL**. The requirements specify those technologies/framework choices and three roles: System Administrator, Normal User and Store Owner. fileciteturn0file0L2-L17

## Features
- Single JWT login with role-based access.
- Normal-user registration.
- Admin dashboard: user/store/rating counts, user and store management, filters, sorting, details, creation of users/stores.
- Normal-user store search, overall rating, personal rating, rating create/update and password change.
- Store-owner dashboard with average rating and users who rated the store.
- Server-side validation for name, address, password and email.
- Parameterized SQL queries and bcrypt password hashing.
- PostgreSQL schema with foreign keys, unique constraints and indexes.
- Docker Compose for PostgreSQL.
- Responsive React UI.

The requested validation rules are implemented as specified: name 20–60 characters, address up to 400, password 8–16 with an uppercase and special character, and standard email validation. fileciteturn0file0L64-L69

## Requirements
- Node.js 20+
- Docker Desktop (recommended) or PostgreSQL 16+

## 1. Start PostgreSQL
```bash
docker compose up -d
```

## 2. Configure backend
```bash
cd backend
copy .env.example .env
npm install
```

Linux/macOS:
```bash
cp .env.example .env
```

## 3. Seed demo data
```bash
npm run seed
```

## 4. Start backend
```bash
npm run dev
```
API: `http://localhost:5000`

## 5. Start frontend in another terminal
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Demo accounts
After seeding:
- Admin: `admin@example.com` / `Admin@123`
- Store owner: `owner@example.com` / `Owner@123`
- Normal user: `user@example.com` / `User@123`

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/password`
- `GET /api/stores`
- `POST /api/stores` (admin)
- `GET /api/admin/stats` (admin)
- `GET /api/admin/users` (admin)
- `POST /api/admin/users` (admin)
- `GET /api/admin/users/:id` (admin)
- `GET /api/admin/stores` (admin)
- `POST /api/ratings` (normal user)
- `PUT /api/ratings/:storeId` (normal user)
- `GET /api/owner/dashboard` (store owner)

## Architecture
```text
React/Vite -> Express REST API -> PostgreSQL
                 |
                 +-> JWT authentication
                 +-> bcrypt password hashing
                 +-> role middleware
```

The implementation covers the challenge's listing search/filter/sort requirements and rating workflows. fileciteturn0file0L29-L36 fileciteturn0file0L46-L63
