# Day Status Application

A full-stack web application for tracking and managing daily status notes across a 12-month, 31-day calendar grid. Authenticated users can manage statuses; the public can view any day's status without logging in.

---

## Features

- **Public Day Status Viewer** — Anyone can browse to any date and view its status. No login required.
- **Authenticated Dashboard** — A protected 12×31 calendar grid where logged-in users can add, edit, and delete status notes for any valid date.
- **Calendar Grid** — A scrollable table with sticky headers. Invalid dates (e.g. February 30, April 31) are automatically disabled.
- **Day Status Editing** — Click any valid cell to open a modal editor with quick-select suggestions and full text input.
- **Leap Year Handling** — February correctly shows 28 or 29 days based on the selected year.
- **Year Selection** — Both the dashboard and the viewer support selecting a year (defaulting to the current year).
- **SQL Persistence** — All status data is stored in PostgreSQL using Prisma ORM with normalized date records.
- **Authentication** — Secure JWT-based auth stored in HTTP-only cookies. Passwords hashed with bcrypt.
- **REST API** — Clean RESTful API with consistent JSON responses, proper HTTP status codes, and server-side validation.
- **Loading / Error / Empty States** — Every data-fetching operation has proper UI feedback.
- **Responsive UI** — Works on desktop, tablet, and mobile. The calendar grid has horizontal scrolling on small viewports.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| Forms | React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT (HTTP-only cookie), bcryptjs |
| Testing (BE) | Jest, Supertest |
| Testing (FE) | Vitest, React Testing Library |
| Linting | ESLint (Next.js + TypeScript) |

---

## Architecture

```
┌─────────────────────────────────┐
│      Next.js Frontend           │
│  (App Router / React / Tailwind)│
│                                 │
│  /           — Public viewer    │
│  /login      — Login page       │
│  /register   — Register page    │
│  /dashboard  — Protected grid   │
└──────────────┬──────────────────┘
               │ HTTP + credentials (cookie)
               ▼
┌─────────────────────────────────┐
│      Express API Server         │
│  Route → Controller             │
│       → Service                 │
│       → Repository → Prisma     │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│       PostgreSQL Database       │
│  User   DayStatus               │
│  (unique date constraint)       │
└─────────────────────────────────┘
```

Authentication flow:
1. User submits credentials to `POST /api/auth/login`
2. Backend validates, signs a JWT, sets it as an HTTP-only cookie
3. Frontend calls `GET /api/auth/me` on load to hydrate auth state
4. Protected routes redirect to `/login` if not authenticated
5. `POST /api/auth/logout` clears the cookie server-side

---

## Prerequisites

- **Node.js** 20+
- **npm** 9+
- **PostgreSQL** 14+

---

## Project Structure

```
day-status-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # DB schema
│   │   └── seed.ts                # Demo data seeder
│   ├── src/
│   │   ├── config/                # App config + Prisma client
│   │   ├── controllers/           # HTTP request handlers
│   │   ├── middleware/            # Auth + error middleware
│   │   ├── repositories/          # Database access layer
│   │   ├── routes/                # Express routers
│   │   ├── services/              # Business logic
│   │   ├── types/                 # TypeScript types
│   │   ├── utils/                 # Date utilities + response helpers
│   │   ├── __tests__/             # Jest + Supertest tests
│   │   ├── app.ts                 # Express app setup
│   │   └── server.ts              # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Public viewer (/)
│   │   ├── login/page.tsx         # Login (/login)
│   │   ├── register/page.tsx      # Register (/register)
│   │   ├── dashboard/page.tsx     # Dashboard (/dashboard)
│   │   ├── layout.tsx             # Root layout + providers
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/                  # LoginForm, RegisterForm
│   │   ├── calendar/              # CalendarGrid, CalendarCell, DayStatusDialog
│   │   ├── day-status/            # DayStatusViewer
│   │   ├── layout/                # NavBar
│   │   └── ui/                    # Button, Dialog, Badge, EmptyState, ErrorState, LoadingSpinner
│   ├── hooks/                     # useAuth, useDayStatuses
│   ├── lib/                       # API client
│   ├── types/                     # TypeScript types
│   ├── utils/                     # Date utilities + tests
│   ├── .env.local.example
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Environment Setup

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/day_status_db"
JWT_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Database Setup

### 1. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE day_status_db;"
```

Or using `createdb`:

```bash
createdb -U postgres day_status_db
```

### 2. Generate Prisma client

```bash
cd backend
npm install
npx prisma generate
```

### 3. Run migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed demo data (optional but recommended)

```bash
npm run db:seed
```

This creates:
- A demo user: `demo@example.com` / `Demo1234!`
- 10 sample day statuses for the year 2026

---

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:5000`

Health check: `http://localhost:5000/health`

### Start the frontend (in a separate terminal)

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Demo Login

After seeding the database:

| Field | Value |
|---|---|
| Email | `demo@example.com` |
| Password | `Demo1234!` |

> These are development-only demo credentials. Do not use in production.

---

## API Documentation

All responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message"
  }
}
```

### Auth Endpoints

#### `POST /api/auth/register`
```json
// Request
{ "email": "user@example.com", "password": "SecurePass123" }

// Response 201
{ "success": true, "data": { "user": { "id": "...", "email": "..." } } }
```

#### `POST /api/auth/login`
Sets an HTTP-only `token` cookie on success.
```json
// Request
{ "email": "user@example.com", "password": "SecurePass123" }

// Response 200
{ "success": true, "data": { "user": { "id": "...", "email": "..." } } }
```

#### `POST /api/auth/logout`
Clears the auth cookie.

#### `GET /api/auth/me`
Requires authentication cookie.
```json
// Response 200
{ "success": true, "data": { "user": { "id": "...", "email": "...", "createdAt": "..." } } }
```

### Day Status Endpoints

#### `GET /api/day-status?year=2026`
Public. Returns all statuses for the given year.
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "statuses": [
      { "date": "2026-01-05", "status": "Office", "updatedAt": "...", "updatedBy": { "email": "..." } }
    ]
  }
}
```

#### `GET /api/day-status/:date`
Public. `:date` must be a real calendar date in `YYYY-MM-DD` format.
- `200` with `data: null` if no status exists
- `400` if the date is invalid (e.g. `2026-02-30`)

#### `POST /api/day-status`
Protected. Creates or updates a status.
```json
// Request
{ "date": "2026-10-03", "status": "Office" }

// Response 201
{ "success": true, "data": { "status": { "date": "2026-10-03", "status": "Office", ... } } }
```

#### `PUT /api/day-status/:date`
Protected. Updates status for an existing date.
```json
// Request body
{ "status": "Work from home" }
```

#### `DELETE /api/day-status/:date`
Protected. Deletes the status for a date.

---

## Running Tests

### Backend tests

```bash
cd backend
npm test
```

Tests include:
- Date utility unit tests (31 cases including leap years, invalid months, invalid days)
- Auth integration tests (register, login, invalid credentials, protected endpoints)
- Day status integration tests (CRUD, public access, unauthorized mutations, invalid dates)

> **Note:** Tests require a running PostgreSQL database. Configure `DATABASE_URL` in `backend/.env`.

### Frontend tests

```bash
cd frontend
npm test
```

Tests include:
- Date utility unit tests (mirrors backend coverage)

---

## Linting

### Backend

```bash
cd backend
npm run lint
```

### Frontend

```bash
cd frontend
npm run lint
```

---

## Build

### Backend

```bash
cd backend
npm run build
```

Output: `backend/dist/`

### Frontend

```bash
cd frontend
npm run build
```

Output: `frontend/.next/`

---

## Design Decisions

### Why PostgreSQL + Prisma?

PostgreSQL's `DATE` type stores calendar dates without time or timezone, which is exactly what's needed — no risk of a UTC conversion accidentally shifting `2026-10-03` to `2026-10-02`. Prisma provides type-safe database access and schema migrations.

### Why is the date stored as a real SQL `DATE`?

A `DATE` column (`YYYY-MM-DD`) with a `UNIQUE` constraint ensures exactly one status record per calendar date at the database level — not enforced only in application code. Invalid dates like `February 30` are impossible to store because PostgreSQL will reject them.

### Why HTTP-only cookies for auth?

Storing JWTs in `localStorage` exposes them to XSS attacks. HTTP-only cookies are inaccessible to JavaScript and are automatically sent with every request — the right choice for a session-like auth token.

### How invalid calendar dates are handled

The date validation logic lives in `backend/src/utils/date.utils.ts` (backend) and `frontend/utils/date.ts` (frontend). Both use JavaScript's `new Date(year, month, 0).getDate()` to determine days in a month, which correctly handles leap years. The backend validates all dates before any database operation; the frontend disables invalid cells in the UI.

### Why the `status` field is free text

The assignment specifies that users can enter "data" for each day but doesn't define a format. A free-text field (max 255 characters) is practical and flexible — users can enter "Office", "WFH", "Leave", custom notes, etc. Quick-select suggestions are provided in the UI for convenience.

### Year selection

The application defaults to the current year and allows selecting years within ±2 of the current year (and up to ±2 past). All API requests include the year as part of the date string (`YYYY-MM-DD`), so multi-year data is fully supported.

---

## Assumptions

- The assignment does not define a specific data format for each day. A free-text status/note field (1–255 characters) was implemented. Users can enter values like "Office", "Leave", "WFH", "Holiday", or any custom text.
- The assignment does not specify a particular year. The current year is used as the default, with a year selector provided.
- Authentication is implemented for both creating and updating statuses. Any authenticated user can edit any day's status (there is no per-user ownership of status entries — statuses are global calendar entries, not personal ones).
- Registration is open to allow reviewers to create their own accounts. In production, you might restrict this.

---

## Known Limitations

- The backend integration tests require a live PostgreSQL database. There is no in-memory mock database.
- No pagination for the year-wide status fetch (up to 366 records per year is acceptable for this use case).

---

## Future Improvements

- Add per-user status privacy (each user manages their own calendar).
- Add a color-coding system for known status types (Office = blue, Leave = red, etc.).
- Add a monthly view alternative to the full annual grid.
- Add export to CSV/iCal.
- Add refresh token rotation for longer-lived sessions.
- Add Docker Compose for one-command local setup.
