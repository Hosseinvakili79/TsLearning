#!/usr/bin/env node
/**
 * Smoke check: register → team → project → task
 * Usage: node scripts/smoke-mvp.mjs
 */
const API = process.env.API_URL ?? 'http://localhost:3000/api/v1';

async function req(path, options = {}, token) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} → ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

const email = `smoke_${Date.now()}@example.com`;
const password = 'password123';

const tokens = await req('/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    firstName: 'تست',
    lastName: 'کاربر',
    email,
    password,
  }),
});

const team = await req(
  '/teams',
  { method: 'POST', body: JSON.stringify({ name: 'تیم تست', description: 'smoke' }) },
  tokens.accessToken,
);

const project = await req(
  `/teams/${team.id}/projects`,
  { method: 'POST', body: JSON.stringify({ name: 'پروژه تست' }) },
  tokens.accessToken,
);

const task = await req(
  `/projects/${project.id}/tasks`,
  {
    method: 'POST',
    body: JSON.stringify({ title: 'وظیفه تست', status: 'TODO' }),
  },
  tokens.accessToken,
);

const dashboard = await req('/dashboard', { method: 'GET' }, tokens.accessToken);

console.log(
  JSON.stringify(
    {
      ok: true,
      email,
      teamId: team.id,
      projectId: project.id,
      taskId: task.id,
      projectsCount: dashboard.projectsCount,
    },
    null,
    2,
  ),
);
