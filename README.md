# Project Management Platform

Persian RTL project management MVP with a Notion-like minimal UI.

## Stack

- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Redux Toolkit + React Router + Tailwind CSS + Vazirmatn
- **Auth:** JWT access tokens + DB-backed refresh token rotation

## Structure

- `backend/` — NestJS API (`/api/v1/...`)
- `frontend/` — React app (Persian UI, RTL)
- `docs/SRS.md` — requirements

## Setup

### Backend

```bash
cd backend
cp .env.example .env   # set DATABASE_URL and JWT secrets
npm install
npx prisma db push
npm run start:dev
```

### Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api/v1
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`).

## MVP features

- Auth (register / login / logout / profile / change password)
- Teams, members, invitations
- Projects and project members
- Tasks (list + Kanban), comments, labels
- Activity log, in-app notifications
- Persian dashboard (RTL, Notion-like minimal theme)

## Smoke check

With the API running:

```bash
cd backend && node scripts/smoke-mvp.mjs
```
