# Project Management Platform Scaffold

This repository now contains a baseline implementation scaffold for the SRS-defined platform using:

- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Redux Toolkit
- **Auth:** short-lived JWT access tokens with DB-backed refresh token rotation
- **Authorization baseline:** team roles (`OWNER`, `ADMIN`, `MEMBER`)

## Structure

- `/home/runner/work/TsLearning/TsLearning/backend` NestJS API
- `/home/runner/work/TsLearning/TsLearning/frontend` React application

## Notes

- Redis is intentionally **deferred** for a future scalability phase.
- File storage and other future features are intentionally not included in this MVP scaffold.
