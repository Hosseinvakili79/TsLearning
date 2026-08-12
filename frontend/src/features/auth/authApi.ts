import type { AuthTokens, AuthUser } from '../../shared/types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(errorBody?.message ?? 'Request failed');
  }

  return (await response.json()) as T;
}

export function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return request<AuthTokens>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<AuthTokens>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function refresh(refreshToken: string) {
  return request<AuthTokens>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function me(accessToken: string) {
  return request<AuthUser>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
}

export async function logout(accessToken: string): Promise<void> {
  await request<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
}
